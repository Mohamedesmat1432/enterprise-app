import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/users/domain/entities/user.entity';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Repository } from 'typeorm';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let userRepo: Repository<User>;
    let roleRepo: Repository<Role>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        userRepo = app.get(getRepositoryToken(User));
        roleRepo = app.get(getRepositoryToken(Role));

        const companyRepo = app.get(getRepositoryToken(Company));
        const permRepo = app.get(getRepositoryToken(Permission));

        // Cleanup
        await userRepo.query(`DELETE FROM "user_roles_role"`);
        await userRepo.query(`DELETE FROM "user_sessions"`);
        await userRepo.query(`DELETE FROM "user"`);
        await roleRepo.query(`DELETE FROM "role_permissions_permission"`);
        await roleRepo.query(`DELETE FROM "role"`);
        await permRepo.query(`TRUNCATE TABLE "permission" CASCADE`);
        await companyRepo.query(`TRUNCATE TABLE "companies" CASCADE`);

        // Create Permissions
        const createUsers = await permRepo.save({ slug: 'create.users', description: 'Create Users' });
        const readUsers = await permRepo.save({ slug: 'read.users', description: 'Read Users' });
        const updateUsers = await permRepo.save({ slug: 'update.users', description: 'Update Users' });
        const deleteUsers = await permRepo.save({ slug: 'delete.users', description: 'Delete Users' });
        const assignRoles = await permRepo.save({ slug: 'assign.roles', description: 'Assign Roles' });

        // Create Company
        const company = await companyRepo.save({
            name: 'User Test Inc',
            currencyCode: 'USD',
            isActive: true
        });

        // Create Admin Role
        const adminRole = await roleRepo.save({
            name: 'Admin',
            description: 'Administrator',
            companyId: company.id
        });

        // Assign permissions to role
        adminRole.permissions = [createUsers, readUsers, updateUsers, deleteUsers, assignRoles];
        await roleRepo.save(adminRole);

        // Create Admin User
        const adminUser = await userRepo.save(userRepo.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password', // Will be hashed by entity listener
            age: 30,
            companyId: company.id,
            activeCompanyId: company.id,
            companies: [company],
            roles: [adminRole]
        }));

        // Login to get token
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@example.com', password: 'password' });

        adminToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close(); // Clean shutdown
    });

    it('/users (GET) - Fail without token', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(401);
    });

    it('/users (GET) - Success with Admin token', () => {
        return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body.data)).toBeTruthy();
            });
    });

    it('/users (POST) - Create User', async () => {
        const dto: CreateUserDto = {
            name: 'New User',
            email: 'newuser@example.com',
            password: 'password',
            age: 20
        };
        return request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dto)
            .expect(201)
            .expect((res) => {
                expect(res.body.email).toBe(dto.email);
            });
    });
});
