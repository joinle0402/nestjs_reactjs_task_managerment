import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@/task/enums/task-status.enum';
import { TaskPriority } from '@/task/enums/task-priority.enum';
import { UserResponse } from '@/user/dtos/user.response';

export class TaskResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiProperty({ enum: TaskStatus })
    status: TaskStatus;

    @ApiProperty({ enum: TaskPriority })
    priority: TaskPriority;

    @ApiProperty({ type: () => UserResponse })
    createdBy: UserResponse;

    @ApiPropertyOptional()
    dueDate?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
