import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ErrorDIalogInterceptor, HttpError } from './core/interceptor/error-dialog.interceptor';
import { MainSocket } from './core/socket/main-socket';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();

    constructor(
        private errorHandler: ErrorDIalogInterceptor,
        private socket: MainSocket,
    ) {}

    ngOnInit(): void {
        this.socket
            .fromEvent<HttpError>('exception')
            .pipe(takeUntil(this.destroy$))
            .subscribe(e => this.errorHandler.handleError(e));
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}