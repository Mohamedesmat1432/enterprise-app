import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from './domain/entities/user-session.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { CompaniesModule } from '../companies/companies.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { TypeOrmUserSessionRepository } from './infrastructure/persistence/typeorm-user-session.repository';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSession]),
    UsersModule,
    CompaniesModule,
    RolesModule,
    PermissionsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LoginUseCase,
    RegisterUserUseCase,
    {
      provide: 'IUserSessionRepository',
      useClass: TypeOrmUserSessionRepository,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, LoginUseCase, RegisterUserUseCase, 'IUserSessionRepository'],
})
export class AuthModule { }
