import { User } from '../entities/user.entity';
import { ITenantRepository } from '@app/../core/domain/repositories/base-repository.interface';
import { UserQueryDto } from '../../dto/user-query.dto';

export interface IUserRepository extends ITenantRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByEmailWithAuth(email: string): Promise<User | null>;
    findAllPaginated(query: UserQueryDto, companyId?: string): Promise<any>;
}
