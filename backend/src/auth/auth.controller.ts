import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RegisterRequest } from '@/auth/dtos/register.request';
import { AuthResponse } from '@/auth/dtos/auth-response';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequest } from '@/auth/dtos/login.request';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { LoggedInUser } from '@/auth/types/logged-in-user.type';

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

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Lấy thông tin user đang đăng nhập' })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@CurrentUser() user: LoggedInUser): LoggedInUser {
        return user;
    }
}
