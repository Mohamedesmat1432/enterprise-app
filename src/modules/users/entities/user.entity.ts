import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@modules/roles/entities/role.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

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

  @DeleteDateColumn()
  deletedAt?: Date;

  // Track if password was changed to avoid rehashing
  private passwordChanged = false;

  @BeforeInsert()
  async hashPasswordOnInsert() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    // Only hash if password was actually changed
    if (this.password && this.passwordChanged) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      this.passwordChanged = false;
    }
  }

  // Method to set password and mark it as changed
  setPassword(newPassword: string) {
    this.password = newPassword;
    this.passwordChanged = true;
  }

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  // Helper method to check for a role
  hasRole(roleName: string): boolean {
    return this.roles?.some((role) => role.name === roleName) || false;
  }

  // Helper method to check for a permission via roles
  hasPermission(permissionSlug: string): boolean {
    return (
      this.roles?.some((role) =>
        role.permissions?.some(
          (permission) => permission.slug === permissionSlug,
        ),
      ) || false
    );
  }

  // Check if account is locked
  isLocked(): boolean {
    if (this.status === 'locked') {
      return true;
    }
    if (this.lockedUntil && new Date() < this.lockedUntil) {
      return true;
    }
    return false;
  }

  // Reset failed login attempts
  resetFailedAttempts() {
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
  }

  // Increment failed login attempts and lock if needed
  incrementFailedAttempts() {
    // Import constant at top of file for performance
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

    this.failedLoginAttempts += 1;

    // Lock account after max failed attempts
    if (this.failedLoginAttempts >= MAX_ATTEMPTS) {
      this.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    }
  }
}
