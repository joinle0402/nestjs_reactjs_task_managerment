import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterRequest {
    @IsNotEmpty()
    fullname: string;
    @IsEmail()
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @MinLength(4)
    password: string;
}
