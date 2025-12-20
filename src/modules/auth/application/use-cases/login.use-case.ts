import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { LoginDto } from '../../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@modules/users/domain/entities/user.entity';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    ) { }

    async execute(dto: LoginDto): Promise<User> {
        const user = await this.userRepo.findByEmailWithAuth(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.isLocked()) {
            throw new UnauthorizedException('Account is locked');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            user.incrementFailedAttempts();
            await this.userRepo.update(user.id, {
                failedLoginAttempts: user.failedLoginAttempts,
                lockedUntil: user.lockedUntil
            });
            throw new UnauthorizedException('Invalid credentials');
        }

        // Reset failed attempts on success
        if (user.failedLoginAttempts > 0) {
            user.resetFailedAttempts();
            await this.userRepo.update(user.id, {
                failedLoginAttempts: 0,
                lockedUntil: null
            });
        }

        return user;
    }
}
