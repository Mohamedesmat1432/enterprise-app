import { UsersService } from '@modules/users/services/users.service';
import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailForAuth(email);

    if (!user) {
      this.logger.warn(`Login attempt for non-existent user: ${email}`);
      return null;
    }

    // Check if account is locked
    if (user.isLocked()) {
      this.logger.warn(`Login attempt for locked account: ${email}`);
      await this.usersService.incrementFailedAttempts(user.id);
      throw new UnauthorizedException(
        'Account is locked due to multiple failed login attempts. Please try again later.',
      );
    }

    // Check if account is disabled
    if (user.status === 'disabled') {
      this.logger.warn(`Login attempt for disabled account: ${email}`);
      throw new UnauthorizedException('Account is disabled.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Failed login attempt for user: ${email}`);
      await this.usersService.incrementFailedAttempts(user.id);
      return null;
    }

    // Successful login - reset failed attempts and update last login
    await this.usersService.resetFailedAttempts(user.id);
    await this.usersService.updateLastLogin(user.id);

    this.logger.log(`Successful login for user: ${email}`);

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.name,
      sub: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      // Create user
      const user = await this.usersService.create(registerDto);

      // Auto-assign 'User' role
      try {
        await this.usersService.assignRole(user.id, 'User');
      } catch (e) {
        this.logger.error(
          'Default role "User" not found or could not be assigned.',
          e,
        );
      }

      this.logger.log(`New user registered: ${user.email}`);

      return user;
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
