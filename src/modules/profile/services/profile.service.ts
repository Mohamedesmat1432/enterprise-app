import { Injectable } from '@nestjs/common';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly getProfileUseCase: GetProfileUseCase,
        private readonly updateProfileUseCase: UpdateProfileUseCase,
    ) { }

    async getProfile(userId: string) {
        return this.getProfileUseCase.execute(userId);
    }

    async updateProfile(userId: string, dto: UpdateUserDto) {
        return this.updateProfileUseCase.execute(userId, dto);
    }
}
