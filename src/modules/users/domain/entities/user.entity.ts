import {
    Entity,
    Column,
    BeforeInsert,
    BeforeUpdate,
    ManyToMany,
    JoinTable,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { BaseTenantEntity } from '@core/domain/entities/base.entity';

@Entity('user')
export class User extends BaseTenantEntity {
    @ManyToMany(() => Company)
    @JoinTable({
        name: 'user_companies',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'company_id', referencedColumnName: 'id' },
    })
    companies: Company[];

    @Index()
    @ApiProperty()
    @Column({ name: 'active_company_id', type: 'uuid', nullable: true })
    activeCompanyId: string;

    @ManyToOne(() => Company, (company) => company.users)
    @JoinColumn({ name: 'active_company_id' })
    company: Company;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ unique: true })
    email: string;

    @ApiProperty()
    @Column()
    age: number;

    @ApiProperty()
    @Exclude()
    @Column({ select: false })
    password!: string;

    @ApiProperty({ enum: ['active', 'locked', 'disabled'] })
    @Column({ type: 'varchar', default: 'active' })
    status: 'active' | 'locked' | 'disabled';

    @ApiProperty()
    @Column({ type: 'int', default: 0 })
    failedLoginAttempts: number;

    @ApiProperty()
    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', nullable: true })
    lockedUntil: Date | null;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({ name: 'user_roles_role' })
    roles: Role[];

    // Track if password was changed to avoid rehashing
    private passwordChanged = false;

    @BeforeInsert()
    async hashPasswordOnInsert() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            this.passwordChanged = false;
        }
    }

    @BeforeUpdate()
    async hashPasswordOnUpdate() {
        if (this.password && this.passwordChanged) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            this.passwordChanged = false;
        }
    }

    setPassword(newPassword: string) {
        this.password = newPassword;
        this.passwordChanged = true;
    }

    hasRole(roleName: string): boolean {
        return this.roles?.some((role) => role.name === roleName) || false;
    }

    hasPermission(permissionSlug: string): boolean {
        return (
            this.roles?.some((role) =>
                role.permissions?.some(
                    (permission) => permission.slug === permissionSlug,
                ),
            ) || false
        );
    }

    isLocked(): boolean {
        if (this.status === 'locked') return true;
        if (this.lockedUntil && new Date() < this.lockedUntil) return true;
        return false;
    }

    resetFailedAttempts() {
        this.failedLoginAttempts = 0;
        this.lockedUntil = null;
    }

    incrementFailedAttempts() {
        const MAX_ATTEMPTS = 5;
        const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
        this.failedLoginAttempts += 1;
        if (this.failedLoginAttempts >= MAX_ATTEMPTS) {
            this.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        }
    }
}
