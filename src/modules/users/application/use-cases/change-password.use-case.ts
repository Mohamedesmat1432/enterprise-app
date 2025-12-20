import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import type { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@modules/users/domain/entities/user.entity';

@Injectable()
export class ChangePasswordUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    ) { }

    async execute(userId: string, dto: ChangePasswordDto): Promise<void> {
        const userEntity = await this.userRepo.findById(userId);
        if (!userEntity) {
            throw new BadRequestException('User not found');
        }

        const user = await this.userRepo.findByEmailWithAuth(userEntity.email);
        if (!user) {
            throw new BadRequestException('User auth details not found');
        }

        const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Invalid current password');
        }

        user.setPassword(dto.newPassword);
        await this.userRepo.save(user);
    }
}
