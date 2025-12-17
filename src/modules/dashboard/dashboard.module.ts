import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';

@Module({
    imports: [UsersModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
