
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseUUIDPipe,
    Request,
    UseGuards,
} from '@nestjs/common';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { CreateWarehouseDto } from '@modules/inventory/dto/create-warehouse.dto';
import { CreateStockLocationDto } from '@modules/inventory/dto/create-stock-location.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { CreateWarehouseUseCase } from '../application/use-cases/create-warehouse.use-case';
import { GetWarehousesUseCase } from '../application/use-cases/get-warehouses.use-case';
import { CreateStockLocationUseCase } from '../application/use-cases/create-stock-location.use-case';
import { GetStockLocationsUseCase } from '../application/use-cases/get-stock-locations.use-case';
import { GetInventoryUseCase } from '../application/use-cases/get-inventory.use-case';
import { ValidateStockMoveUseCase } from '../application/use-cases/validate-stock-move.use-case';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('inventory')
export class InventoryController {
    constructor(
        private readonly createWarehouseUseCase: CreateWarehouseUseCase,
        private readonly getWarehousesUseCase: GetWarehousesUseCase,
        private readonly createLocationUseCase: CreateStockLocationUseCase,
        private readonly getLocationsUseCase: GetStockLocationsUseCase,
        private readonly getInventoryUseCase: GetInventoryUseCase,
        private readonly validateStockMoveUseCase: ValidateStockMoveUseCase,
    ) { }

    @Post('warehouses')
    @Permissions('create.inventory')
    @ApiOperation({ summary: 'Create a new warehouse' })
    createWarehouse(@Body() dto: CreateWarehouseDto, @Request() req) {
        return this.createWarehouseUseCase.execute(req.user.companyId, dto, req.user.id);
    }

    @Get('warehouses')
    @Permissions('read.inventory')
    @ApiOperation({ summary: 'Get all warehouses' })
    findAllWarehouses(@Request() req) {
        return this.getWarehousesUseCase.execute(req.user.companyId);
    }

    @Post('locations')
    @Permissions('create.inventory')
    @ApiOperation({ summary: 'Create a new stock location' })
    createLocation(@Body() dto: CreateStockLocationDto, @Request() req) {
        return this.createLocationUseCase.execute(req.user.companyId, dto, req.user.id);
    }

    @Get('locations')
    @Permissions('read.inventory')
    @ApiOperation({ summary: 'Get all locations' })
    findAllLocations(@Request() req) {
        return this.getLocationsUseCase.execute(req.user.companyId);
    }

    @Get('quants')
    @Permissions('read.inventory')
    @ApiOperation({ summary: 'Get inventory levels' })
    getInventory(@Request() req) {
        return this.getInventoryUseCase.execute(req.user.companyId);
    }

    @Post('moves/:id/validate')
    @Permissions('update.inventory')
    @ApiOperation({ summary: 'Validate a stock move' })
    validateMove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.validateStockMoveUseCase.execute(req.user.companyId, id, req.user.id);
    }
}
