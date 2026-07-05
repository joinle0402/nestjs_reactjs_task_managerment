import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RegisterRequest } from '@/auth/dtos/register.request';
import { AuthResponse } from '@/auth/dtos/auth-response';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequest } from '@/auth/dtos/login.request';

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

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @Post('login')
    login(@Body() request: LoginRequest): Promise<AuthResponse> {
        return this.authService.login(request);
    }
}
