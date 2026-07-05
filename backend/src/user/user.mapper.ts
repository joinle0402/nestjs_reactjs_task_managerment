import { Mapper, transform } from '@ilhamtahir/ts-mapper';
import { Injectable } from '@nestjs/common';
import { UserResponse } from '@/user/dtos/user.response';
import { UserEntity } from '@/user/user.entity';

@Mapper()
@Injectable()
export class UserMapper {
    toResponse(entity: UserEntity): UserResponse {
        return transform(this, 'toResponse', entity, UserResponse);
    }

    toResponseList(entities: UserEntity[]): UserResponse[] {
        return entities.map((entity) => this.toResponse(entity));
    }
}
