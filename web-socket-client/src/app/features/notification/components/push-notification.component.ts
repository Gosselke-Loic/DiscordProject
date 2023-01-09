import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, filter, mergeMap, takeUntil } from "rxjs";
import { AuthService, User } from "../../auth/service/auth.service";
import { SubscriptionService } from "../../user/service/subscription.service";
import { NotificationService } from "../service/notification.service";

@Component({
    selector: 'app-push-notification',
    templateUrl: './push-notification.component.html',
    styleUrls: ['./push-notification.component.scss'],
})
export class PushNotificationComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();

    constructor(
        private authService: AuthService,
        private notificationService: NotificationService,
        private subscriptionService: SubscriptionService,
    ) {}

    ngOnInit(): void {
        this.authService.user$
            .pipe(
                takeUntil(this.destroy$),
                filter<User>(user => user != null),
                mergeMap(() => this.subscriptionService.requestSubscription()),
            )
            .subscribe();

        this.notificationService.updateAvailable$.subscribe();

        this.notificationService.checkForUpdates();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}