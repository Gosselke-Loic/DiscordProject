import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { AuthService, User } from "../auth/service/auth.service";

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnDestroy, OnInit {
    readonly homeRouter = [
        { link: 'login', label: 'Login' },
        { link: 'register', label: 'Register' },
        { link: 'recover', label: 'Forgot my password' }
    ]

    user: User;
    destroy$ = new Subject();

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.user$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => (this.user = user))
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    logout(): void {
        this.authService.logout();
    }
}