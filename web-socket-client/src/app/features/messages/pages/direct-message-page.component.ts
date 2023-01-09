import { Message } from "../service/messages.service";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    interval,
    Subject, 
    catchError, 
    filter, 
    mergeMap, 
    take, 
    takeUntil, 
    tap
} from "rxjs";
import { User } from "../../auth/service/auth.service";
import { UserService } from "../../user/service/user.service";
import { MessageType } from "../components/messages.component";

@Component({
    templateUrl: './direct-message-page.component.html',
    styleUrls: ['./direct-message-page.component.scss'],
})

export class DirectMessagePageComponent implements OnDestroy, OnInit {
    MessageType = MessageType;
    updateMessages$ = new Subject();
    messages: Message[] = [];
    destroy$ = new Subject();
    toName: string;
    to: User;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.route.params
        .pipe(
            takeUntil(this.destroy$),
            mergeMap(params => {
                this.toName = params.username;
        
                return this.userService.getUser(this.toName).pipe(take(1));
            }),
            catchError(() => this.router.navigate(['/'])),
            filter<User>(user => typeof user !== 'boolean'),
            tap(user => {
                this.to = user;
        
                this.changeDetector.detectChanges();
        
                this.updateMessages$.next(true);
            }),
        )
        .subscribe();

        interval(5000)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.to != null),
                mergeMap(() => this.userService.getUser(this.toName).pipe(take(1))),
                tap({
                    next: user => (this.to = user),
                    complete: () => this.router.navigate(['/room'],)
                }),
            )
            .subscribe();
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    
        this.updateMessages$.complete();
    }
}