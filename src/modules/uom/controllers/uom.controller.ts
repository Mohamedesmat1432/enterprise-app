import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseUUIDPipe,
    Request,
} from '@nestjs/common';
import { UomService } from '@modules/uom/services/uom.service';
import { CreateUomDto } from '@modules/uom/dto/create-uom.dto';
import { CreateUomCategoryDto } from '@modules/uom/dto/create-uom-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('uom')
@ApiBearerAuth()
@Controller('uom')
export class UomController {
    constructor(private readonly uomService: UomService) { }

    @Post('categories')
    @Permissions('create.uom')
    @ApiOperation({ summary: 'Create a new UOM category' })
    createCategory(@Body() dto: CreateUomCategoryDto, @Request() req) {
        return this.uomService.createCategory(dto, req.user.companyId);
    }

    @Get('categories')
    @Permissions('read.uom')
    @ApiOperation({ summary: 'Get all UOM categories' })
    findAllCategories(@Request() req) {
        return this.uomService.findAllCategories(req.user.companyId);
    }

    @Post()
    @Permissions('create.uom')
    @ApiOperation({ summary: 'Create a new UOM' })
    createUom(@Body() dto: CreateUomDto, @Request() req) {
        return this.uomService.createUom(dto, req.user.companyId);
    }

    @Get()
    @Permissions('read.uom')
    @ApiOperation({ summary: 'Get all UOMs' })
    findAllUoms(@Request() req) {
        return this.uomService.findAllUoms(req.user.companyId);
    }

    @Get(':id')
    @Permissions('read.uom')
    @ApiOperation({ summary: 'Get a UOM by id' })
    findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.uomService.findOneUom(id, req.user.companyId);
    }
}
