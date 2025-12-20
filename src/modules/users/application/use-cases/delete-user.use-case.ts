import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(id: string, companyId?: string): Promise<void> {
        const user = companyId
            ? await this.userRepository.findByIdAndTenant(id, companyId)
            : await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userRepository.softDelete(id);
    }
}
