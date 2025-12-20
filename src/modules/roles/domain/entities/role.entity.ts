import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@modules/users/domain/entities/user.entity';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';
import { BaseTenantEntity } from '@core/domain/entities/base.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';

@Entity('role')
@Unique(['name', 'companyId'])
export class Role extends BaseTenantEntity {
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'role_permissions_permission' })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
