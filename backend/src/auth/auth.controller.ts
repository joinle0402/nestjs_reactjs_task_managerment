import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RegisterRequest } from '@/auth/dtos/register.request';
import { AuthResponse } from '@/auth/dtos/auth-response';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Register new account' })
    @ApiCreatedResponse({ description: 'Register successfully', type: AuthResponse })
    @Post('register')
    register(@Body() request: RegisterRequest): Promise<AuthResponse> {
        return this.authService.register(request);
    }
}
