import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/users/domain/entities/user.entity';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '@modules/roles/dto/create-role.dto';

describe('RolesController (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let userRepo: Repository<User>;
    let roleRepo: Repository<Role>;
    let companyRepo: Repository<Company>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        userRepo = app.get(getRepositoryToken(User));
        roleRepo = app.get(getRepositoryToken(Role));
        companyRepo = app.get(getRepositoryToken(Company));
        const permRepo = app.get(getRepositoryToken(Permission));

        // Cleanup
        await userRepo.query(`TRUNCATE TABLE "user", "role", "companies", "permission" CASCADE`);

        // Create Permissions
        const createRoles = await permRepo.save({ slug: 'create.roles', description: 'Create Roles' });
        const readRoles = await permRepo.save({ slug: 'read.roles', description: 'Read Roles' });
        const updateRoles = await permRepo.save({ slug: 'update.roles', description: 'Update Roles' });
        const deleteRoles = await permRepo.save({ slug: 'delete.roles', description: 'Delete Roles' });

        // Create Company
        const company = await companyRepo.save(
            companyRepo.create({
                name: 'Test Company',
                email: 'test@company.com',
                isActive: true
            })
        );

        // Create Admin Role
        const adminRole = await roleRepo.save({
            name: 'Admin',
            description: 'Administrator',
            companyId: company.id
        });

        // Assign permissions to role
        adminRole.permissions = [createRoles, readRoles, updateRoles, deleteRoles];
        await roleRepo.save(adminRole);

        // Create Admin User
        const adminUser = await userRepo.save(userRepo.create({
            name: 'Admin User',
            email: 'admin-roles@example.com',
            password: 'password',
            age: 30,
            roles: [adminRole],
            companyId: company.id,
            activeCompanyId: company.id,
            companies: [company]
        }));

        // Login
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin-roles@example.com', password: 'password' });

        adminToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/roles (POST) - Create Role', () => {
        const dto: CreateRoleDto = {
            name: 'Editor',
            description: 'Can edit content'
        };
        return request(app.getHttpServer())
            .post('/roles')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dto)
            .expect(201)
            .expect((res) => {
                expect(res.body.name).toBe(dto.name);
            });
    });

    it('/roles (POST) - Create Duplicate Role should fail', () => {
        const dto: CreateRoleDto = {
            name: 'Editor', // Same name as above
            description: 'Duplicate'
        };
        return request(app.getHttpServer())
            .post('/roles')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dto)
            .expect(409); // Conflict
    });

    it('/roles (GET) - List Roles', () => {
        return request(app.getHttpServer())
            .get('/roles')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body.data)).toBeTruthy();
                expect(res.body.data.length).toBeGreaterThanOrEqual(1); // At least Admin
            });
    });
});
