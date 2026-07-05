import { AuthUserResponse } from '@/user/dtos/user-response';

export class AuthResponse {
    token: string;
    profile: AuthUserResponse;
}
