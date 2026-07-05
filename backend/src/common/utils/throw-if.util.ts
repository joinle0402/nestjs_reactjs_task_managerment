import { HttpException, HttpStatus } from '@nestjs/common';

export function throwIf(condition: boolean, message: string, status: HttpStatus = HttpStatus.BAD_REQUEST): asserts condition is false {
    if (condition) {
        throw new HttpException(message, status);
    }
}

export function throwIfNull<T>(value: T | null | undefined, message: string, status: HttpStatus = HttpStatus.BAD_REQUEST): asserts value is T {
    if (value == null) {
        throw new HttpException(message, status);
    }
}
