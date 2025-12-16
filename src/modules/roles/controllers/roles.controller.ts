import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
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
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @Permissions('create.roles')
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 201, description: 'Role created.' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions('read.roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Return all roles.' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('read.roles')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({ status: 200, description: 'Return role.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update.roles')
  @ApiOperation({ summary: 'Update role' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions('delete.roles')
  @ApiOperation({ summary: 'Delete role' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }

  @Post(':id/permissions')
  @Permissions('assign.permissions')
  @ApiOperation({ summary: 'Add permission to role' })
  @ApiResponse({ status: 200, description: 'Permission added successfully.' })
  assignPermission(
    @Param('id', ParseIntPipe) roleId: number,
    @Body('permissionSlug') permissionSlug: string,
  ) {
    return this.rolesService.addPermission(roleId, permissionSlug);
  }
}
