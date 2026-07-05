import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterRequest } from '@/auth/dtos/register.request';
import { throwIf, throwIfNull } from '@/common/utils/throw-if.util';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { AuthResponse } from '@/auth/dtos/auth-response';
import { LoginRequest } from '@/auth/dtos/login.request';
import { JwtPayload } from '@/auth/types/jwt-payload.type';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    async register(request: RegisterRequest): Promise<AuthResponse> {
        const existed = await this.userRepository.exists({ where: { username: request.username } });
        throwIf(existed, 'Tài khoản này đã tồn tại!', HttpStatus.CONFLICT);
        const registered = await this.userRepository.save({
            ...request,
            password: await hash(request.password, 10),
        });
        return await this.toAuthResponse(registered);
    }

    async login(request: LoginRequest): Promise<AuthResponse> {
        const user = await this.userRepository
            .createQueryBuilder('u')
            .addSelect('u.password')
            .where('u.username = :username', { username: request.username })
            .getOne();
        throwIfNull(user, 'Tên đăng nhập hoặc mật khẩu không đúng!', HttpStatus.UNAUTHORIZED);
        throwIf(!(await compare(request.password, user.password)), 'Tên đăng nhập hoặc mật khẩu không đúng!', HttpStatus.UNAUTHORIZED);
        return await this.toAuthResponse(user);
    }

    private async toAuthResponse({ id, username, fullname }: UserEntity): Promise<AuthResponse> {
        return {
            token: await this.jwtService.signAsync({ id, username, fullname } satisfies JwtPayload, { expiresIn: '1d' }),
            profile: { id, username, fullname },
        };
    }
}
