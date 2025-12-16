import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@modules/roles/entities/role.entity';

@Entity()
export class Permission {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
