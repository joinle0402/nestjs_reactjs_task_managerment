import { Mapper, transform } from '@ilhamtahir/ts-mapper';
import { Injectable } from '@nestjs/common';
import { TaskEntity } from '@/task/entities/task.entity';
import { TaskResponse } from '@/task/dtos/task.response';
import { TaskRequest } from '@/task/dtos/task.request';
import { UserMapper } from '@/user/user.mapper';

@Mapper()
@Injectable()
export class TaskMapper {
    constructor(private readonly userMapper: UserMapper) {}

    toEntity(request: TaskRequest): TaskEntity {
        return transform(this, 'toEntity', request, TaskEntity);
    }

    toResponse(entity: TaskEntity): TaskResponse {
        const response = transform(this, 'toResponse', entity, TaskResponse);
        response.createdBy = this.userMapper.toResponse(entity.createdBy);
        return response;
    }

    toResponseList(entities: TaskEntity[]): TaskResponse[] {
        return entities.map((entity) => this.toResponse(entity));
    }
}
