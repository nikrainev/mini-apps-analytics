import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HttpAdapterHost } from '@nestjs/core';

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
        origin: '*',
    });

    await app.listen(vars.port, '0.0.0.0');
}
bootstrap();
