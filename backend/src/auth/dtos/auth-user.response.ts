import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponse {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'John Smith' })
    fullname: string;
    @ApiProperty({ example: 'johnsmith2001it@gmail.com' })
    username: string;
}
