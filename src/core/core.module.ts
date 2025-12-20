import { Module, Global } from '@nestjs/common';
import { TenantContextService } from './infrastructure/tenant/tenant-context.service';

@Global()
@Module({
    providers: [TenantContextService],
    exports: [TenantContextService],
})
export class CoreModule { }
