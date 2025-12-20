import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';
import { Setting } from '../entities/setting.entity';
import { SettingQueryDto } from '../../dto/setting-query.dto';

export interface ISettingRepository extends ITenantRepository<Setting> {
    findByKey(key: string, companyId: string): Promise<Setting | null>;
    findAllPaginated(query: SettingQueryDto, companyId: string): Promise<any>;
}
