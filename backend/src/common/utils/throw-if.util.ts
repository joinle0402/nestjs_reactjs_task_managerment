import { HttpException, HttpStatus } from '@nestjs/common';

export function throwIf(condition: boolean, message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    if (condition) {
        throw new HttpException(message, status);
    }
}
