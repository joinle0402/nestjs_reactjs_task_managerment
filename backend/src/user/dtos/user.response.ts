import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    fullname: string;
    @ApiProperty()
    username: string;
}
