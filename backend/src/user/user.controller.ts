import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserResponse } from '@/user/dtos/user.response';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Lấy danh sách user' })
    @Get()
    findAll(): Promise<UserResponse[]> {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: 'Lấy thông tin user theo id' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: UserResponse })
    @Get(':id')
    findOne(@Param('id') id: number): Promise<UserResponse> {
        return this.userService.findOne(id);
    }
}
