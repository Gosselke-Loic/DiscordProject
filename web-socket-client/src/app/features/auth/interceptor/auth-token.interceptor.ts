import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from "@angular/common/http";
import { 
    tap, 
    take, 
    mergeMap, 
    catchError, 
    Observable, 
    throwError
} from "rxjs";
import { AuthService } from "../service/auth.service";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
    static skipHeader = 'skipTokenInterceptor';

    constructor(
        private authService: AuthService,
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        request = this.handleRequest(request);
        console.log(request.url)

        if(request.headers.has(AuthTokenInterceptor.skipHeader)) {
            return next.handle(request);
        }

        return next.handle(request).pipe(
            catchError(response => {
                if (response instanceof HttpErrorResponse && response.status === 401) {
                    if (this.authService.getRefreshToken()) {
                        return this.authService.loginWithRefreshToken().pipe(
                            take(1),
                            tap({
                                next: () => {},
                                complete: () => this.authService.logout(),
                            }),
                            mergeMap(() => 
                                next.handle(this.skipRequest(request)).pipe(
                                    tap({
                                        next: () => {},
                                        complete: () => this.authService.logout(),
                                    }),
                                ),
                            ),
                        );
                    }
                    this.authService.logout();
                }
                return throwError(() => new Error(response));
            })
        )
    }

    private skipRequest(request: HttpRequest<unknown>) {
        request = request.clone({
            headers: request.headers.set(AuthTokenInterceptor.skipHeader, 'true'),
        })

        return this.handleRequest(request);
    }

    private handleRequest(request: HttpRequest<unknown>) {
        const token = this.authService.getAccessToken();

        if(token) {
            request = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`),
            })
        }

        return request;
    }
}