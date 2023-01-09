import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
    BehaviorSubject,
    mergeMap,
    tap,
    firstValueFrom,
    take
} from "rxjs";

import { environment } from "src/environments/environment";
import { ErrorDIalogInterceptor } from "src/app/core/interceptor/error-dialog.interceptor";
import { AuthTokenInterceptor } from "../interceptor/auth-token.interceptor";
import { SubscriptionService } from "../../user/service/subscription.service";

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface User {
    _id: string;
    username: string;
    password: string;
    email: string;
    online: boolean;
}

const { api } = environment;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    user$ = new BehaviorSubject<User>(null);

    get user(): User {
        return this.user$.getValue();
    }

    get isAuthenticated(): boolean {
        return this.user != null;
    }

    constructor(
        private http: HttpClient,
        private router: Router,
        private subscriptionService: SubscriptionService,
    ) {}

    login(user: Partial<User>) {
        return this.http
            .post<TokenResponse>(`${api}/auth/login`, user)
            .pipe(mergeMap(response => this.setTokens(response)))
    }
    
    register(user: Partial<User>) {
        return this.http
            .post<TokenResponse>(`${api}/auth/register`, user)
            .pipe(mergeMap(response => this.setTokens(response)));
    }

    getProfile() {
        return this.http
            .get<User>(`${api}/auth/me`, {
                headers: {
                    [ErrorDIalogInterceptor.skipHeader]: 'true',
                },
            })
            .pipe(tap(user => this.user$.next(user)));
    }

    loginWithRefreshToken() {
        return this.http
            .post<TokenResponse>(
                `${api}/auth/refresh-token`,
                {
                    refreshToken: this.getRefreshToken(),
                },
                {
                    headers: {
                        [AuthTokenInterceptor.skipHeader]: 'true',
                    },
                },
            )
            .pipe(mergeMap(response => this.setTokens(response)));
    }

    logoutFromAllDevices() {
        return this.http
            .delete<TokenResponse>(`${api}/auth/logout-from-all-devices`)
            .pipe(
                mergeMap(tokens => this.setTokens(tokens)),
                tap(() => this.subscriptionService.requestSubscription()),
            ); 
    }

    async setTokens(response: TokenResponse) {
        this.setRefreshToken(response.refresh_token)

        return this.setAccessToken(response.access_token)
    }

    getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    async setAccessToken(token: string) {
        localStorage.setItem('accessToken', token)

        return firstValueFrom(this.getProfile());
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    setRefreshToken(token: string) {
        return localStorage.setItem('refreshToken', token);
    }

    getLoginCallbackUrl() {
        return localStorage.getItem('loginCallbackUrl');
    }

    setLoginCallbackUrl(url: string) {
        localStorage.setItem('loginCallbackUrl', url)
    }

    async redirectToCallback() {
        const output = await this.router.navigate([
            this.getLoginCallbackUrl() || '/',
        ]);

        this.setLoginCallbackUrl(null);

        return output;
    }

    logout() {
        const callback = () => {
            sessionStorage.clear();

            localStorage.clear();

            this.user$.next(null);
        }
        
        this.subscriptionService
            .delete()
            .pipe(take(1))
            .subscribe(() => callback())
    }
}