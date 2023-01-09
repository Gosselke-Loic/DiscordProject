import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { FeaturesModule } from './features/features.module';
import { CoreModule } from './core/core.module';
import { ExceptionsFilter } from './core/filter/exception.filter';
import { environments } from './environments/environments';

@Module({
    imports: [
        FeaturesModule,
        CoreModule,
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(environments.mongoUri, {
            autoIndex: false
        })
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true }),
        },
        {
            provide: APP_FILTER,
            useClass: ExceptionsFilter,
        },
    ],
    controllers: [AppController],
})
export class AppModule {}
