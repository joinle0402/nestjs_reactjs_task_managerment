import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserModule } from '@/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '@/task/entities/task.entity';
import { TaskMapper } from '@/task/mappers/task.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity]), UserModule],
    controllers: [TaskController],
    providers: [TaskService, TaskMapper],
})
export class TaskModule {}
