import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { Permission } from '@modules/permissions/entities/permission.entity';
import { Role } from '@modules/roles/entities/role.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { RolesModule } from '@modules/roles/roles.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ProfileModule } from '@modules/profile/profile.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Role, Permission],

        // CRITICAL: Never use synchronize in production!
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        // Enable SSL in production
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    // Enhanced throttler configuration
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute for general endpoints
      },
      {
        name: 'auth',
        ttl: 900000, // 15 minutes
        limit: 5, // 5 requests per 15 minutes for auth endpoints
      },
    ]),
    UsersModule,
    AuthModule,
    RolesModule,
    RolesModule,
    PermissionsModule,
    ProfileModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule { }
