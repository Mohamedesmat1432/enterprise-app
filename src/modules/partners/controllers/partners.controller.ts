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
import { PartnersService } from '@modules/partners/services/partners.service';
import { CreatePartnerDto } from '@modules/partners/dto/create-partner.dto';
import { UpdatePartnerDto } from '@modules/partners/dto/update-partner.dto';
import { PartnerQueryDto } from '@modules/partners/dto/partner-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('partners')
@ApiBearerAuth()
@Controller('partners')
export class PartnersController {
    constructor(private readonly partnersService: PartnersService) { }

    @Post()
    @Permissions('create.partners')
    @ApiOperation({ summary: 'Create a new partner' })
    @ApiResponse({ status: 201, description: 'The partner has been successfully created.' })
    create(@Body() createPartnerDto: CreatePartnerDto, @Request() req) {
        return this.partnersService.create(createPartnerDto, req.user.companyId, req.user.id);
    }

    @Get()
    @Permissions('read.partners')
    @ApiOperation({ summary: 'Get all partners' })
    @ApiResponse({ status: 200, description: 'Return all partners.' })
    findAll(@Query() query: PartnerQueryDto, @Request() req) {
        return this.partnersService.findAll(query, req.user.companyId);
    }

    @Get(':id')
    @Permissions('read.partners')
    @ApiOperation({ summary: 'Get a partner by id' })
    @ApiResponse({ status: 200, description: 'Return the partner.' })
    findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.partnersService.findOne(id, req.user.companyId);
    }

    @Patch(':id')
    @Permissions('update.partners')
    @ApiOperation({ summary: 'Update a partner' })
    @ApiResponse({ status: 200, description: 'The partner has been successfully updated.' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePartnerDto: UpdatePartnerDto,
        @Request() req,
    ) {
        return this.partnersService.update(id, updatePartnerDto, req.user.companyId, req.user.id);
    }

    @Delete(':id')
    @Permissions('delete.partners')
    @ApiOperation({ summary: 'Delete a partner' })
    @ApiResponse({ status: 204, description: 'The partner has been successfully deleted.' })
    remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.partnersService.remove(id, req.user.companyId);
    }
}
