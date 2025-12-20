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
} from '@nestjs/common';
import { CreatePermissionUseCase } from '../application/use-cases/create-permission.use-case';
import { GetPermissionsUseCase } from '../application/use-cases/get-permissions.use-case';
import { GetPermissionUseCase } from '../application/use-cases/get-permission.use-case';
import { UpdatePermissionUseCase } from '../application/use-cases/update-permission.use-case';
import { DeletePermissionUseCase } from '../application/use-cases/delete-permission.use-case';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionQueryDto } from '../dto/permission-query.dto';
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
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
    private readonly getPermissionUseCase: GetPermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) { }

  @Post()
  @Permissions('create.permissions')
  @ApiOperation({ summary: 'Create permission' })
  @ApiResponse({ status: 201, description: 'Permission created.' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.createPermissionUseCase.execute(createPermissionDto);
  }

  @Get()
  @Permissions('read.permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Return all permissions.' })
  findAll(@Query() query: PermissionQueryDto) {
    return this.getPermissionsUseCase.execute(query);
  }

  @Get(':id')
  @Permissions('read.permissions')
  @ApiOperation({ summary: 'Get permission by id' })
  @ApiResponse({ status: 200, description: 'Return permission.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getPermissionUseCase.execute(id);
  }

  @Patch(':id')
  @Permissions('update.permissions')
  @ApiOperation({ summary: 'Update permission' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.updatePermissionUseCase.execute(id, updatePermissionDto);
  }

  @Delete(':id')
  @Permissions('delete.permissions')
  @ApiOperation({ summary: 'Delete permission' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deletePermissionUseCase.execute(id);
    return { message: 'Permission deleted successfully' };
  }
}
