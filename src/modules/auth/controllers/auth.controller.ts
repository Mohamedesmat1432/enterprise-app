import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 minutes
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or account locked.' })
  @ApiResponse({ status: 429, description: 'Too many login attempts.' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  @Throttle({ auth: { limit: 3, ttl: 3600000 } }) // 3 registrations per hour
  @ApiOperation({ summary: 'Register new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error or weak password.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  @ApiResponse({ status: 429, description: 'Too many registration attempts.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
