import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Role } from '@modules/roles/entities/role.entity';
import { Permission } from '@modules/permissions/entities/permission.entity';

import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'P@ssw0rd',
  database: process.env.DB_DATABASE || 'enterprise_db',
  entities: [User, Role, Permission],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
