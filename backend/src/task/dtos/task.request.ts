import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '@/task/enums/task-priority.enum';
import { TaskStatus } from '@/task/enums/task-status.enum';

export class TaskRequest {
    @ApiProperty({ example: 'Thiết kế API task management' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @ApiPropertyOptional({ example: 'Viết CRUD task, search, pagination' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.TODO })
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @ApiPropertyOptional({ enum: TaskPriority, example: TaskPriority.HIGH })
    @IsNotEmpty()
    @IsEnum(TaskPriority)
    priority: TaskPriority;

    @ApiPropertyOptional({ example: '2026-12-30' })
    @IsOptional()
    @IsDateString()
    dueDate?: string;
}
