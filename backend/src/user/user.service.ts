import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '@/user/user.mapper';
import { UserResponse } from '@/user/dtos/user.response';
import { throwIfNull } from '@/common/utils/throw-if.util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly userMapper: UserMapper,
    ) {}

    findById(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<UserResponse[]> {
        const entities = await this.userRepository.find({ order: { id: 'DESC' } });
        return this.userMapper.toResponseList(entities);
    }

    async findOne(id: number): Promise<UserResponse> {
        const entity = await this.findById(id);
        throwIfNull(entity, 'Thông tin người dùng không tồn tại!', HttpStatus.NOT_FOUND);
        return this.userMapper.toResponse(entity);
    }
}
