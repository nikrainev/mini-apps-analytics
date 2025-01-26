"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const core_2 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const vars_1 = require("./config/vars");
const validation_pipe_1 = require("./middlewares/validation.pipe");
const all_exceptions_filter_1 = require("./middlewares/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    const { httpAdapter } = app.get(core_2.HttpAdapterHost);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    app.enableCors({
        origin: '*',
    });
    await app.listen(vars_1.vars.port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map