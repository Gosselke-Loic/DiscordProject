import { MessageService } from './service/messages.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { AuthModule } from '../auth/auth.module';
import { RoomModule } from '../room/room.module';
import { MessageController } from './controller/message.controller';
import { MessageGateway } from './gateway/messages.gateway';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Message.name,
                schema: MessageSchema,
            },
        ]),
        AuthModule,
        RoomModule,
    ],
    controllers: [
        MessageController
    ],
    providers: [
        MessageService,
        MessageGateway
    ],
    exports: [
        MessageService
    ],
})
export class MessagesModule {}