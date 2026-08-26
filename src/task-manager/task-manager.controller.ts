import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TaskManagerService } from './task-manager.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetAllTasksDto } from './dto/get-all-tasks.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt.types';
import { isPrivilegedAdmin } from '../common/helpers/privileged-access.helper';

@ApiTags('TaskManager')
@ApiBearerAuth()
@Auth('admin')
@Controller('task-manager')
export class TaskManagerController {
  constructor(private readonly taskManagerService: TaskManagerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task (admins only)' })
  createTask(@CurrentUser() user: JwtPayload, @Body() dto: CreateTaskDto) {
    if (!isPrivilegedAdmin(user)) {
      throw new ForbiddenException('Access to task manager is restricted.');
    }
    return this.taskManagerService.createTask(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with filters' })
  findAll(@CurrentUser() user: JwtPayload, @Query() dto: GetAllTasksDto) {
    if (!isPrivilegedAdmin(user)) {
      throw new ForbiddenException('Access to task manager is restricted.');
    }
    return this.taskManagerService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single task' })
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    if (!isPrivilegedAdmin(user)) {
      throw new ForbiddenException('Access to task manager is restricted.');
    }
    return this.taskManagerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task status, assignee, priority, or progress' })
  updateTask(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateTaskDto,
  ) {
    if (!isPrivilegedAdmin(user)) {
      throw new ForbiddenException('Access to task manager is restricted.');
    }
    return this.taskManagerService.updateTask(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (admins only)' })
  deleteTask(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    if (!isPrivilegedAdmin(user)) {
      throw new ForbiddenException('Access to task manager is restricted.');
    }
    return this.taskManagerService.deleteTask(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  addComment(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCommentDto,
  ) {
    if (!isPrivilegedAdmin(user)) {
      throw new ForbiddenException('Access to task manager is restricted.');
    }
    return this.taskManagerService.addComment(id, user.id, dto);
  }
}
