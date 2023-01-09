import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/features/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { SubscriptionType } from '../schema/subscription.schema';
import { User } from '../schema/user.schema';
import { SubscriptionService } from '../service/subscription.service';

@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {}

    @Get()
    sendTestingNotification(@CurrentUser() user: User) {
        return this.subscriptionService.sendNotification(user, {
            notification: {
                title: 'Testing',
                body: 'Testing notification',
            },
        });
    }

    @Post('web')
    createWebSubscription(
        @Body('subscription') body: PushSubscriptionJSON,
        @CurrentUser() user: User,
    ) {
        return this.createSubscription(
            user,
            SubscriptionType.Web,
            JSON.stringify(body),
        );
    }

    private async createSubscription(
        user: User,
        type: SubscriptionType,
        body: string,
    ) {
        if (!body) {
            throw new BadRequestException('Subscription body empty');
        }

        const subscription = await this.subscriptionService.get(user, type, body);

        return subscription || this.subscriptionService.create(user, type, body);
    }

    @Delete('web')
    deleteWebSubscription(
        @Body('subscription') body: PushSubscriptionJSON,
        @CurrentUser() user: User,
    ) {
        return this.deleteSubscription(
            user,
            SubscriptionType.Web,
            JSON.stringify(body),
        );
    }

    private async deleteSubscription(
        user: User,
        type: SubscriptionType,
        body: string,
    ) {
        if (!body) {
            throw new BadRequestException('Subscription body empty');
        }

        return this.subscriptionService.delete(user, type, body);
    }
}