import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/users/domain/entities/user.entity';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Repository } from 'typeorm';

describe('DashboardController (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let userRepo: Repository<User>;
    let roleRepo: Repository<Role>;
    let permRepo: Repository<Permission>;
    let companyRepo: Repository<Company>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        userRepo = app.get(getRepositoryToken(User));
        roleRepo = app.get(getRepositoryToken(Role));
        permRepo = app.get(getRepositoryToken(Permission));
        companyRepo = app.get(getRepositoryToken(Company));

        // Cleanup
        await userRepo.query(`DELETE FROM "user_roles_role"`);
        await userRepo.query(`DELETE FROM "user_sessions"`);
        await userRepo.query(`DELETE FROM "user"`);
        await roleRepo.query(`DELETE FROM "role_permissions_permission"`);
        await roleRepo.query(`DELETE FROM "role"`);
        await permRepo.query(`TRUNCATE TABLE "permission" CASCADE`);
        await companyRepo.query(`TRUNCATE TABLE "companies" CASCADE`);

        // Create Permissions
        const readDashboard = await permRepo.save({ slug: 'read.dashboard', description: 'Read Dashboard' });
        const readReport = await permRepo.save({ slug: 'read.reports', description: 'Read Reports' });

        // Create Company
        const company = await companyRepo.save({
            name: 'Test Inc',
            currencyCode: 'USD',
            isActive: true
        });

        // Create Admin Role with permissions
        const adminRole = await roleRepo.save({
            name: 'Admin',
            description: 'Administrator',
            companyId: company.id
        });

        // Assign permissions to role (need to use save relation)
        adminRole.permissions = [readDashboard, readReport];
        await roleRepo.save(adminRole);

        // Create Admin User linked to company
        const adminUser = await userRepo.save(userRepo.create({
            name: 'Admin User',
            email: 'admin-dash@example.com',
            password: 'password',
            age: 30,
            companyId: company.id,
            activeCompanyId: company.id,
            companies: [company],
            roles: [adminRole]
        }));

        // Login
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin-dash@example.com', password: 'password' });

        adminToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/dashboard/stats (GET)', () => {
        return request(app.getHttpServer())
            .get('/dashboard/stats')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
    });

    it('/dashboard/reports/pl (GET)', () => {
        return request(app.getHttpServer())
            .get('/dashboard/reports/pl')
            .set('Authorization', `Bearer ${adminToken}`)
            .query({ startDate: '2024-01-01', endDate: '2024-12-31' })
            .expect(200);
    });

    it('/dashboard/reports/balance-sheet (GET)', () => {
        return request(app.getHttpServer())
            .get('/dashboard/reports/balance-sheet')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
    });
});
