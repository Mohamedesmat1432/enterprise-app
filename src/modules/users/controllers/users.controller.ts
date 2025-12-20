import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUsersUseCase } from '../application/use-cases/get-users.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { ChangePasswordUseCase } from '../application/use-cases/change-password.use-case';
import { AssignRoleUseCase } from '../application/use-cases/assign-role.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AssignRoleDto } from '../dto/assign-role.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserQueryDto } from '../dto/user-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly assignRoleUseCase: AssignRoleUseCase,
  ) { }

  // ⚠️ IMPORTANT: Static routes must come BEFORE parameterized routes
  // Otherwise 'me' would be interpreted as an :id parameter

  @Post('me/change-password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid current password.' })
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.changePasswordUseCase.execute(req.user.userId, dto);
  }

  @Post()
  @Permissions('create.users')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreateUserDto, @Request() req) {
    return this.createUserUseCase.execute(dto, req.user.companyId);
  }

  @Get()
  @Permissions('read.users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  findAll(@Request() req, @Query() query: UserQueryDto) {
    return this.getUsersUseCase.execute(query, req.user.companyId);
  }

  @Get(':id')
  @Permissions('read.users')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.getUserUseCase.execute(id, req.user.companyId);
  }

  @Patch(':id')
  @Permissions('update.users')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  update(@Request() req, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, dto, req.user.companyId);
  }

  @Delete(':id')
  @Permissions('delete.users')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.deleteUserUseCase.execute(id, req.user.companyId);
  }

  @Post(':id/roles')
  @Permissions('update.users')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully.' })
  @ApiResponse({ status: 404, description: 'User or Role not found.' })
  assignRole(
    @Request() req,
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: AssignRoleDto,
  ) {
    return this.assignRoleUseCase.execute(userId, dto.roleName, req.user.companyId);
  }
}
