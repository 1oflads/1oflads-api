import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const errors = [];
        if (exception.constructor.name === BadRequestException.name) {
            errors.push(exception.message.message.map(x => x.property + '__' + Object.keys(x.constraints).join("_")));
        } else {
            errors.push(exception.constructor.name);
        }

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                errors: errors
            });
    }
}
