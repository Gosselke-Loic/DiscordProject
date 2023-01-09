import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { MaterialModule } from './shared/material/material.module';
import { SharedModule } from './shared/shared.module';
import { FeaturesModule } from './features/features.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

import { firstValueFrom } from 'rxjs';
import { AuthService } from './features/auth/service/auth.service';
import { AuthTokenInterceptor } from './features/auth/interceptor/auth-token.interceptor';
import { ErrorDIalogInterceptor } from './core/interceptor/error-dialog.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';

const initialize = (authService: AuthService) => async () => {
    if(authService.getAccessToken()) {
        try {
            await firstValueFrom(authService.getProfile())
        } catch {}
    }
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        MaterialModule,
        SharedModule,
        FeaturesModule,
        BrowserAnimationsModule,
        CoreModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: true,
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
            provide: APP_INITIALIZER,
            useFactory: initialize,
            deps: [AuthService],
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthTokenInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorDIalogInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
