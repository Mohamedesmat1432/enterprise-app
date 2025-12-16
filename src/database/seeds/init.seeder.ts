import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '@app/app.module';
import { PermissionsService } from '@modules/permissions/services/permissions.service';
import { RolesService } from '@modules/roles/services/roles.service';
import { UsersService } from '@modules/users/services/users.service';

/**
 * Enhanced Database Seeder
 * Uses NestJS application context and services for business logic consistency.
 * This ensures all validations, password hashing, and error handling
 * are applied the same way as the API.
 */
async function seed() {
  const logger = new Logger('Seeder');
  logger.log('🌱 Starting database seeding...');

  // Create NestJS application context (no HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const permissionsService = app.get(PermissionsService);
  const rolesService = app.get(RolesService);
  const usersService = app.get(UsersService);

  try {
    // ========================
    // SEED PERMISSIONS
    // ========================
    logger.log('📋 Seeding Permissions...');

    const permissionsData = [
      // Users Permissions
      { slug: 'create.users', description: 'Can create new users' },
      { slug: 'read.users', description: 'Can read user details' },
      { slug: 'update.users', description: 'Can update user details' },
      { slug: 'delete.users', description: 'Can delete users' },
      { slug: 'assign.roles', description: 'Can assign roles to users' },

      // Roles Permissions
      { slug: 'create.roles', description: 'Can create new roles' },
      { slug: 'read.roles', description: 'Can read role details' },
      { slug: 'update.roles', description: 'Can update role details' },
      { slug: 'delete.roles', description: 'Can delete roles' },
      { slug: 'assign.permissions', description: 'Can assign permissions to roles' },

      // Permissions Permissions
      { slug: 'create.permissions', description: 'Can create new permissions' },
      { slug: 'read.permissions', description: 'Can read permission details' },
      { slug: 'update.permissions', description: 'Can update permission details' },
      { slug: 'delete.permissions', description: 'Can delete permissions' },
    ];

    for (const permData of permissionsData) {
      try {
        await permissionsService.create(permData);
        logger.log(`  ✅ Created permission: ${permData.slug}`);
      } catch (error) {
        if (error.status === 409) {
          logger.log(`  ⏭️  Permission already exists: ${permData.slug}`);
        } else {
          throw error;
        }
      }
    }

    // ========================
    // SEED ROLES
    // ========================
    logger.log('👤 Seeding Roles...');

    const rolesData = [
      {
        name: 'Admin',
        description: 'System Administrator with full access',
        permissions: permissionsData.map((p) => p.slug), // All permissions
      },
      {
        name: 'User',
        description: 'Standard User with limited access',
        permissions: ['read.users'], // Limited permissions
      },
      {
        name: 'Manager',
        description: 'Manager with user management access',
        permissions: [
          'read.users',
          'update.users',
          'read.roles',
          'assign.roles',
        ],
      },
    ];

    for (const roleData of rolesData) {
      try {
        await rolesService.create(roleData);
        logger.log(`  ✅ Created role: ${roleData.name}`);
      } catch (error) {
        if (error.status === 409) {
          logger.log(`  ⏭️  Role already exists: ${roleData.name}`);
        } else {
          throw error;
        }
      }
    }

    // ========================
    // SEED USERS
    // ========================
    logger.log('👥 Seeding Users...');

    const usersData = [
      {
        name: 'Super Admin',
        email: 'admin@example.com',
        age: 30,
        password: 'Admin@123!', // Strong password meeting requirements
        roles: ['Admin'],
      },
      {
        name: 'Standard User',
        email: 'user@example.com',
        age: 25,
        password: 'User@123!', // Strong password meeting requirements
        roles: ['User'],
      },
      {
        name: 'John Manager',
        email: 'manager@example.com',
        age: 35,
        password: 'Manager@123!', // Strong password meeting requirements
        roles: ['Manager'],
      },
    ];

    for (const userData of usersData) {
      try {
        const user = await usersService.create(userData);
        logger.log(`  ✅ Created user: ${userData.email}`);
      } catch (error) {
        if (error.status === 409) {
          logger.log(`  ⏭️  User already exists: ${userData.email}`);
        } else {
          throw error;
        }
      }
    }

    logger.log('');
    logger.log('✨ Seeding completed successfully!');
    logger.log('');
    logger.log('📝 Test Accounts:');
    logger.log('   Admin: admin@example.com / Admin@123!');
    logger.log('   User:  user@example.com / User@123!');
    logger.log('   Manager: manager@example.com / Manager@123!');
    logger.log('');
  } catch (error) {
    logger.error('❌ Seeding failed:', error.message);
    logger.error(error.stack);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Run the seeder
seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
