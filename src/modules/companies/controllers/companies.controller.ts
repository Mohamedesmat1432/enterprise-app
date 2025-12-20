import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
} from '@nestjs/common';
import { CreateCompanyDto } from '@modules/companies/dto/create-company.dto';
import { UpdateCompanyDto } from '@modules/companies/dto/update-company.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { CreateCompanyUseCase } from '../application/use-cases/create-company.use-case';
import { GetCompaniesUseCase } from '../application/use-cases/get-companies.use-case';
import { GetCompanyUseCase } from '../application/use-cases/get-company.use-case';
import { UpdateCompanyUseCase } from '../application/use-cases/update-company.use-case';
import { DeleteCompanyUseCase } from '../application/use-cases/delete-company.use-case';

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly createCompanyUseCase: CreateCompanyUseCase,
        private readonly getCompaniesUseCase: GetCompaniesUseCase,
        private readonly getCompanyUseCase: GetCompanyUseCase,
        private readonly updateCompanyUseCase: UpdateCompanyUseCase,
        private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
    ) { }

    @Post()
    @Permissions('create.companies')
    @ApiOperation({ summary: 'Create a new company' })
    @ApiResponse({ status: 201, description: 'The company has been successfully created.' })
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.createCompanyUseCase.execute(createCompanyDto);
    }

    @Get()
    @Permissions('read.companies')
    @ApiOperation({ summary: 'Get all companies' })
    @ApiResponse({ status: 200, description: 'Return all companies.' })
    findAll() {
        return this.getCompaniesUseCase.execute();
    }

    @Get(':id')
    @Permissions('read.companies')
    @ApiOperation({ summary: 'Get a company by id' })
    @ApiResponse({ status: 200, description: 'Return the company.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.getCompanyUseCase.execute(id);
    }

    @Patch(':id')
    @Permissions('update.companies')
    @ApiOperation({ summary: 'Update a company' })
    @ApiResponse({ status: 200, description: 'The company has been successfully updated.' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.updateCompanyUseCase.execute(id, updateCompanyDto);
    }

    @Delete(':id')
    @Permissions('delete.companies')
    @ApiOperation({ summary: 'Delete a company' })
    @ApiResponse({ status: 204, description: 'The company has been successfully deleted.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.deleteCompanyUseCase.execute(id);
    }
}
