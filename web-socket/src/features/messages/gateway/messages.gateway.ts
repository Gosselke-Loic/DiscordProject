import {
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

import { ExceptionsFilter } from "src/core/filter/exception.filter";
import { environments } from "src/environments/environments";
import { ParseObjectIdPipe } from "src/shared/pipe/parse-ObjectId.pipe";
import { CurrentUser } from "src/features/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/features/auth/guard/jwt-auth.guard";
import { RoomService } from "src/features/room/service/room.service";
import { User } from "src/features/user/schema/user.schema";
import { UserService } from "src/features/user/service/user.service";
import { DirectMessageDto } from "../dto/direct-message.dto";
import { RoomMessageDto } from "../dto/room-message.dto";
import { MessageService } from "../service/messages.service";

import { SubscriptionService } from "src/features/user/service/subscription.service";

@UsePipes(new ValidationPipe())
@UseFilters(new ExceptionsFilter())
@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class MessageGateway {
    @WebSocketServer() server: Server;

    constructor(
        private userService: UserService,
        private roomService: RoomService,
        private MessageService: MessageService,
        private subscriptionService: SubscriptionService,
    ) {}

    @SubscribeMessage('message:direct')
    async sendDirectMessage(
        @MessageBody() body: DirectMessageDto,
        @CurrentUser() user: User,
    ) {
        const userTo = await this.userService.validateUserById(body.to);

        const message = await this.MessageService.createDirectMessage(
            user,
            userTo,
            body.message,
        );

        this.userService.sendMessage(user, 'message:direct', message);
        this.userService.sendMessage(userTo, 'message:direct', message);

        if(userTo.id === user.id) {
            return true;
        }

       const url = environments.frontEndUrl;

       this.subscriptionService.sendNotification(userTo, {
            notification: {
                title: user.username,
                body: message.message,
            },
            webData: {
                onActionClick: {
                    default: {
                        operation: 'navigateLastFocusedOrOpen',
                        url: `${url}/direct-message/${user.username}`,
                    }
                },
            },
        });

        return true;
    }

    @SubscribeMessage('message:direct:typing')
    async sendDirectTyping(
        @MessageBody(new ParseObjectIdPipe()) userId: string,
        @CurrentUser() user: User,
    ) {
        return this.userService.sendMessage(
            await this.userService.validateUserById(userId),
            'message:direct:typing',
            { user: this.userService.filterUser(user) },
        );
    }

    @SubscribeMessage('message:room')
    async sendRoomMessage(
        @MessageBody() body: RoomMessageDto,
        @CurrentUser() user: User,
    ) {
        const room = await this.roomService.validateRoom(body.roomId);

        const message = await this.MessageService.createRoomMessage(
            user,
            room,
            body.message,
        );

        const url = environments.frontEndUrl;

        for(const member of room.members) {
            if(member.id === user.id) {
                continue;
            }

            this.subscriptionService.sendNotification(member, {
                notification: {
                    title: room.title,
                    body: `${user.username}: ${message.message}`,
                },
                webData: {
                    onActionClick: {
                        default: {
                            operation: 'navigateLastFocusedOrOpen',
                            url: `${url}/room/${room._id}`,
                        },
                    },
                },
            });
        }

        return this.roomService.sendMessage(room, 'message:room', message);
    }

    @SubscribeMessage('message:room:typing')
    async sendRoomTyping(
        @MessageBody(new ParseObjectIdPipe()) roomId: string,
        @ConnectedSocket() socket: Socket,
        @CurrentUser() user: User,
    ) {
        const room = await this.roomService.validateRoom(roomId);

        return this.roomService.sendMessageExcept(
            socket,
            room,
            'message:room:typing',
            { room, user: this.userService.filterUser(user) },
        );
    }
}