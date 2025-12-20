
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './domain/entities/audit-log.entity';
import { AuditLogsService } from './services/audit-logs.service';
import { AuditLogsController } from './controllers/audit-logs.controller';
import { TypeOrmAuditLogRepository } from './infrastructure/persistence/typeorm-audit-log.repository';
import { CreateAuditLogUseCase } from './application/use-cases/create-audit-log.use-case';
import { GetAuditLogsUseCase } from './application/use-cases/get-audit-logs.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([AuditLog])],
    providers: [
        {
            provide: 'IAuditLogRepository',
            useClass: TypeOrmAuditLogRepository,
        },
        AuditLogsService,
        CreateAuditLogUseCase,
        GetAuditLogsUseCase,
    ],
    controllers: [AuditLogsController],
    exports: [AuditLogsService], // Facade exported for other modules
})
export class AuditLogsModule { }
