import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {AppExceptionFilter} from "./core/handler/AppExceptionFilter";
import {AppAuthGuard} from "./auth/guard/AppAuthGuard";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new AppExceptionFilter());

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new AppAuthGuard(reflector));

    await app.listen(3000);
}

bootstrap();
