import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@/user/user.service';
import { JwtPayload } from '@/auth/types/jwt-payload.type';
import { throwIfNull } from '@/common/utils/throw-if.util';
import { LoggedInUser } from '@/auth/types/logged-in-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secret',
        });
    }

    async validate(payload: JwtPayload): Promise<LoggedInUser> {
        const user = await this.userService.findById(payload.id);
        throwIfNull(user, 'Token không hợp lệ!', HttpStatus.UNAUTHORIZED);
        return { id: user.id, username: user.username, fullname: user.fullname };
    }
}
