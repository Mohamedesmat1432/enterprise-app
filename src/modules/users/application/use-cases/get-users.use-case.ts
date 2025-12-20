import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserQueryDto } from '../../dto/user-query.dto';

@Injectable()
export class GetUsersUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(query: UserQueryDto, companyId?: string) {
        return await this.userRepository.findAllPaginated(query, companyId);
    }
}
