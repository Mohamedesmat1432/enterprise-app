import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { User } from '@modules/users/domain/entities/user.entity';

@Injectable()
export class GetProfileUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userId: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('Profile not found');
        }
        return user;
    }
}
