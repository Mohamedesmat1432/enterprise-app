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
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { GetProductsUseCase } from '../application/use-cases/get-products.use-case';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
    constructor(
        private readonly createUseCase: CreateProductUseCase,
        private readonly getProductsUseCase: GetProductsUseCase,
        private readonly getProductUseCase: GetProductUseCase,
        private readonly updateUseCase: UpdateProductUseCase,
        private readonly deleteUseCase: DeleteProductUseCase,
    ) { }

    @Post()
    @Permissions('create.products')
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
    create(@Body() createProductDto: CreateProductDto, @Request() req) {
        return this.createUseCase.execute(req.user.companyId, createProductDto, req.user.id);
    }

    @Get()
    @Permissions('read.products')
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Return all products.' })
    findAll(@Query() query: ProductQueryDto, @Request() req) {
        return this.getProductsUseCase.execute(req.user.companyId, query);
    }

    @Get(':id')
    @Permissions('read.products')
    @ApiOperation({ summary: 'Get a product by id' })
    @ApiResponse({ status: 200, description: 'Return the product.' })
    findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.getProductUseCase.execute(req.user.companyId, id);
    }

    @Patch(':id')
    @Permissions('update.products')
    @ApiOperation({ summary: 'Update a product' })
    @ApiResponse({ status: 200, description: 'The product has been successfully updated.' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Request() req,
    ) {
        return this.updateUseCase.execute(req.user.companyId, id, updateProductDto, req.user.id);
    }

    @Delete(':id')
    @Permissions('delete.products')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 204, description: 'The product has been successfully deleted.' })
    remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.deleteUseCase.execute(req.user.companyId, id);
    }
}
