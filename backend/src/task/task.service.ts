import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '@/task/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskMapper } from '@/task/mappers/task.mapper';
import { TaskRequest } from '@/task/dtos/task.request';
import { TaskResponse } from '@/task/dtos/task.response';
import { UserService } from '@/user/user.service';
import { throwIfNull } from '@/common/utils/throw-if.util';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>,
        private readonly taskMapper: TaskMapper,
        private readonly userService: UserService,
    ) {}

    async create(request: TaskRequest, userId: number): Promise<TaskResponse> {
        const entity = this.taskMapper.toEntity(request);
        entity.createdBy = await this.userService.findByIdOrFail(userId);
        const saved = await this.taskRepository.save(entity);
        return this.taskMapper.toResponse(saved);
    }

    async findAll(): Promise<TaskResponse[]> {
        const entities = await this.taskRepository.find({
            relations: { createdBy: true },
            order: { id: 'DESC' },
        });
        return this.taskMapper.toResponseList(entities);
    }

    async findOne(id: number): Promise<TaskResponse> {
        const entity = await this.taskRepository.findOne({ where: { id }, relations: { createdBy: true } });
        throwIfNull(entity, 'Thông tin task không tồn tại!', HttpStatus.NOT_FOUND);
        return this.taskMapper.toResponse(entity);
    }

    async update(id: number, request: TaskRequest): Promise<TaskResponse> {
        const entity = await this.taskRepository.findOne({ where: { id }, relations: { createdBy: true } });
        throwIfNull(entity, 'Thông tin task không tồn tại!', HttpStatus.NOT_FOUND);
        if (request.title !== undefined) entity.title = request.title;
        if (request.description !== undefined) entity.description = request.description;
        if (request.status !== undefined) entity.status = request.status;
        if (request.priority !== undefined) entity.priority = request.priority;
        if (request.dueDate !== undefined) entity.dueDate = new Date(request.dueDate);
        const saved = await this.taskRepository.save(entity);
        return this.taskMapper.toResponse(saved);
    }

    async delete(id: number): Promise<void> {
        const entity = await this.taskRepository.findOne({ where: { id } });
        throwIfNull(entity, 'Thông tin task không tồn tại!', HttpStatus.NOT_FOUND);
        await this.taskRepository.remove(entity);
    }
}
