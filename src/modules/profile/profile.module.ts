import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';

@Module({
    imports: [UsersModule],
    controllers: [ProfileController],
    providers: [
        ProfileService,
        GetProfileUseCase,
        UpdateProfileUseCase,
    ],
    exports: [
        ProfileService,
        GetProfileUseCase,
        UpdateProfileUseCase,
    ],
})
export class ProfileModule { }
