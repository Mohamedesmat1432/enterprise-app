import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 minutes
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or account locked.' })
  @ApiResponse({ status: 429, description: 'Too many login attempts.' })
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string = 'Unknown',
  ) {
    const user = await this.loginUseCase.execute(loginDto);
    return this.authService.login(user, { ip, userAgent: userAgent || 'Unknown' });
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token using refresh token' })
  async refresh(
    @Body('refresh_token') refreshToken: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string = 'Unknown',
  ) {
    return this.authService.refreshTokens(refreshToken, ip, userAgent || 'Unknown');
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  async logout(@Body('refresh_token') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Post('switch-company')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Switch active company context' })
  async switchCompany(@Body('companyId') companyId: string, @Request() req) {
    return this.authService.switchCompany(req.user.userId, companyId);
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
    return this.registerUserUseCase.execute(registerDto);
  }
}
