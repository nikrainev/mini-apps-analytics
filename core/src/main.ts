import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HttpAdapterHost } from '@nestjs/core';
import fastifyCookie from '@fastify/cookie';

import { AppModule } from './app.module';
import { vars } from './config/vars';
import { ValidationPipe } from './middlewares/validation.pipe';
import { AllExceptionsFilter } from './middlewares/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: ['http://localhost:3000/', 'http://localhost:3000'],
        credentials: true,
    });
    await app.register(fastifyCookie, {
        secret: 'my-secret',
    });

    await app.listen(vars.port, '0.0.0.0');
}
bootstrap();
