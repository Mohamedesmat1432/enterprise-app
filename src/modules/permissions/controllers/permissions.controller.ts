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
import { PermissionsService } from '../services/permissions.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @Permissions('create.permissions')
  @ApiOperation({ summary: 'Create permission' })
  @ApiResponse({ status: 201, description: 'Permission created.' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Permissions('read.permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Return all permissions.' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Permissions('read.permissions')
  @ApiOperation({ summary: 'Get permission by id' })
  @ApiResponse({ status: 200, description: 'Return permission.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update.permissions')
  @ApiOperation({ summary: 'Update permission' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Permissions('delete.permissions')
  @ApiOperation({ summary: 'Delete permission' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(id);
  }
}
