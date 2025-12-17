import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';

@Module({
    imports: [UsersModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule { }
