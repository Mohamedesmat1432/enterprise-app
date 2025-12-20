import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Request,
} from '@nestjs/common';
import { CreateRoleUseCase } from '../application/use-cases/create-role.use-case';
import { GetRolesUseCase } from '../application/use-cases/get-roles.use-case';
import { GetRoleUseCase } from '../application/use-cases/get-role.use-case';
import { UpdateRoleUseCase } from '../application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../application/use-cases/delete-role.use-case';
import { AssignPermissionUseCase } from '../application/use-cases/assign-permission.use-case';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleQueryDto } from '../dto/role-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly assignPermissionUseCase: AssignPermissionUseCase,
  ) { }

  @Post()
  @Permissions('create.roles')
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 201, description: 'Role created.' })
  create(@Request() req, @Body() createRoleDto: CreateRoleDto) {
    return this.createRoleUseCase.execute(createRoleDto, req.user.companyId);
  }

  @Get()
  @Permissions('read.roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Return all roles.' })
  findAll(@Request() req, @Query() query: RoleQueryDto) {
    return this.getRolesUseCase.execute(query, req.user.companyId);
  }

  @Get(':id')
  @Permissions('read.roles')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({ status: 200, description: 'Return role.' })
  findOne(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.getRoleUseCase.execute(id, req.user.companyId);
  }

  @Patch(':id')
  @Permissions('update.roles')
  @ApiOperation({ summary: 'Update role' })
  update(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.updateRoleUseCase.execute(id, updateRoleDto, req.user.companyId);
  }

  @Delete(':id')
  @Permissions('delete.roles')
  @ApiOperation({ summary: 'Delete role' })
  async remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    await this.deleteRoleUseCase.execute(id, req.user.companyId);
    return { message: 'Role deleted successfully' };
  }

  @Post(':id/permissions')
  @Permissions('assign.permissions')
  @ApiOperation({ summary: 'Add permission to role' })
  @ApiResponse({ status: 200, description: 'Permission added successfully.' })
  assignPermission(
    @Request() req,
    @Param('id', ParseUUIDPipe) roleId: string,
    @Body('permissionSlug') permissionSlug: string,
  ) {
    return this.assignPermissionUseCase.execute(roleId, permissionSlug, req.user.companyId);
  }
}
