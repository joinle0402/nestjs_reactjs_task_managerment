import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '@/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from '@/user/user.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, UserMapper],
    exports: [UserService, UserMapper],
})
export class UserModule {}
