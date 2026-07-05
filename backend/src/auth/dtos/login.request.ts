import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FieldLabel } from '@/common/decorators/field-label.decorator';

export class LoginRequest {
    @ApiProperty({ example: 'johnsmith2001it@gmail.com' })
    @FieldLabel('Tên đăng nhập')
    @IsNotEmpty()
    username: string;
    @ApiProperty({ example: '1106' })
    @FieldLabel('Mật khẩu')
    @IsNotEmpty()
    password: string;
}
