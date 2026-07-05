import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
    @ApiProperty({ example: 'John Smith' })
    @IsNotEmpty()
    fullname: string;
    @ApiProperty({ example: 'johnsmith2001it@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    username: string;
    @ApiProperty({ example: '1106' })
    @IsNotEmpty()
    @MinLength(4)
    password: string;
}
