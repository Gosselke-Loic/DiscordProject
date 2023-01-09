import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisIoAdapter } from './core/adapter/redis-io.adapter';
import { CustomSocketIoAdapter } from './core/adapter/custom-socket-io.adapter';

import { AppModule } from './app.module';

import { environments } from './environments/environments';

const redis = environments.redis;
 
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: "http://localhost:8080"
    });
    app.enableShutdownHooks();
    app.set('trust proxy', environments.proxyEnabled);

    if (redis.enabled) {
        app.useWebSocketAdapter(new RedisIoAdapter(redis.host, app));
    } else {
        app.useWebSocketAdapter(new CustomSocketIoAdapter(app));
    }

    const port = environments.port;
    const logger = new Logger('NewDiscord');

    await app.listen(port, () => 
        logger.log(`Server is running on port ${port}`)
    );
}
bootstrap();