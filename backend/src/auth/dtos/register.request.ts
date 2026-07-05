import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FieldLabel } from '@/common/decorators/field-label.decorator';

export class RegisterRequest {
    @ApiProperty({ example: 'John Smith' })
    @FieldLabel('Họ tên')
    @IsNotEmpty()
    fullname: string;
    @ApiProperty({ example: 'johnsmith2001it@gmail.com' })
    @FieldLabel('Tên đăng nhập')
    @IsEmail()
    @IsNotEmpty()
    username: string;
    @ApiProperty({ example: '1106' })
    @FieldLabel('Mật khẩu')
    @IsNotEmpty()
    @MinLength(4)
    password: string;
}
