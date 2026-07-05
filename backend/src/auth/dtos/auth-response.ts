import { AuthUserResponse } from '@/user/dtos/user-response';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huc2' })
    token: string;
    @ApiProperty({ type: AuthUserResponse })
    profile: AuthUserResponse;
}
