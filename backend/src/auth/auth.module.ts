import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '1d' } })],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
