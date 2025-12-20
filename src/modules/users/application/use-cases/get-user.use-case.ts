import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class GetUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(id: string, companyId?: string): Promise<User> {
        const user = companyId
            ? await this.userRepository.findByIdAndTenant(id, companyId)
            : await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}
