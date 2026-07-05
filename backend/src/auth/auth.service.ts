import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterRequest } from '@/auth/dtos/register.request';
import { throwIf } from '@/common/utils/throw-if.util';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { AuthResponse } from '@/auth/dtos/auth-response';

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

    private async toAuthResponse({ id, username, fullname }: UserEntity): Promise<AuthResponse> {
        return {
            token: await this.jwtService.signAsync({ id, username, fullname }, { expiresIn: '1d' }),
            profile: { id, username, fullname },
        };
    }
}
