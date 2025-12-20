import { Entity, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { BaseEntity } from '@core/domain/entities/base.entity';

@Entity()
export class Permission extends BaseEntity {

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
