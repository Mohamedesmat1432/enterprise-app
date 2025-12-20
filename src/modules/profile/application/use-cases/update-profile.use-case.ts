import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { User } from '@modules/users/domain/entities/user.entity';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';

@Injectable()
export class UpdateProfileUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userId: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('Profile not found');
        }

        Object.assign(user, dto);
        return await this.userRepository.save(user);
    }
}
