import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@/config/swagger.config';
import { formatValidationErrors } from '@/common/validation/validation-error.helper';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: 422,
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            stopAtFirstError: true,
            validationError: {
                target: true,
                value: false,
            },
            exceptionFactory: (errors) => {
                return new UnprocessableEntityException({
                    timestamp: new Date().toISOString(),
                    status: 422,
                    message: 'Validation failed',
                    errors: formatValidationErrors(errors),
                });
            },
        }),
    );
    app.setGlobalPrefix('/api/v1');
    setupSwagger(app);
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
