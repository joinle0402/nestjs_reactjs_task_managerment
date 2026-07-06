import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from '@/task/task.service';
import { TaskResponse } from '@/task/dtos/task.response';
import { TaskRequest } from '@/task/dtos/task.request';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @ApiOperation({ summary: 'Tạo task' })
    @Post()
    create(@Body() request: TaskRequest, @CurrentUser('id') userId: number): Promise<TaskResponse> {
        return this.taskService.create(request, userId);
    }

    @ApiOperation({ summary: 'Lấy danh sách tác vụ' })
    @Get()
    findAll(): Promise<TaskResponse[]> {
        return this.taskService.findAll();
    }

    @ApiOperation({ summary: 'Lấy thông tin task theo id' })
    @Get(':id')
    findOne(@Param('id') id: number): Promise<TaskResponse> {
        return this.taskService.findOne(id);
    }

    @ApiOperation({ summary: 'Cập nhật task' })
    @Patch(':id')
    update(@Param('id') id: number, @Body() request: TaskRequest): Promise<TaskResponse> {
        return this.taskService.update(id, request);
    }

    @ApiOperation({ summary: 'Xóa task' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: number): Promise<void> {
        return this.taskService.delete(id);
    }
}
