import { PartialType } from '@nestjs/swagger';
import { CreateSalesOrderDto } from '@modules/sales/dto/create-sales-order.dto';

export class UpdateSalesOrderDto extends PartialType(CreateSalesOrderDto) { }
