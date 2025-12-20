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
import { CreateCompanyDto } from '@modules/companies/dto/create-company.dto';
import { UpdateCompanyDto } from '@modules/companies/dto/update-company.dto';

describe('CompaniesController (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let userRepo: Repository<User>;
    let roleRepo: Repository<Role>;
    let permRepo: Repository<Permission>;
    let companyRepo: Repository<Company>;

    let testCompanyId: string;

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
        const createCompany = await permRepo.save({ slug: 'create.companies', description: 'Create Companies' });
        const readCompany = await permRepo.save({ slug: 'read.companies', description: 'Read Companies' });
        const updateCompany = await permRepo.save({ slug: 'update.companies', description: 'Update Companies' });
        const deleteCompany = await permRepo.save({ slug: 'delete.companies', description: 'Delete Companies' });

        // Create Context Company
        const company = await companyRepo.save({
            name: 'Context Inc',
            currencyCode: 'USD',
            isActive: true
        });

        // Create Admin Role with permissions
        const adminRole = await roleRepo.save({
            name: 'Admin',
            description: 'Administrator',
            companyId: company.id
        });

        // Assign permissions to role
        adminRole.permissions = [createCompany, readCompany, updateCompany, deleteCompany];
        await roleRepo.save(adminRole);

        // Create Admin User linked to company
        const adminUser = await userRepo.save(userRepo.create({
            name: 'Admin User',
            email: 'admin-comp@example.com',
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
            .send({ email: 'admin-comp@example.com', password: 'password' });

        adminToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/companies (POST) - Create Company', () => {
        const dto: CreateCompanyDto = {
            name: 'New Global Corp',
            legalName: 'New Global Corp Ltd',
            currencyCode: 'EUR',
            email: 'contact@global.com'
        };

        return request(app.getHttpServer())
            .post('/companies')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dto)
            .expect(201)
            .expect((res) => {
                expect(res.body.name).toBe(dto.name);
                expect(res.body.id).toBeDefined();
                testCompanyId = res.body.id;
            });
    });

    it('/companies (GET) - List Companies', () => {
        return request(app.getHttpServer())
            .get('/companies')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBeTruthy();
                // Should have Context Inc and New Global Corp
                expect(res.body.length).toBeGreaterThanOrEqual(2);
            });
    });

    it('/companies/:id (GET) - Get Company', () => {
        return request(app.getHttpServer())
            .get(`/companies/${testCompanyId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toBe(testCompanyId);
                expect(res.body.currencyCode).toBe('EUR');
            });
    });

    it('/companies/:id (PATCH) - Update Company', () => {
        const dto: UpdateCompanyDto = {
            phone: '+1-555-0199'
        };

        return request(app.getHttpServer())
            .patch(`/companies/${testCompanyId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dto)
            .expect(200)
            .expect((res) => {
                expect(res.body.phone).toBe(dto.phone);
            });
    });

    it('/companies/:id (DELETE) - Delete Company', () => {
        return request(app.getHttpServer())
            .delete(`/companies/${testCompanyId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
    });

    it('/companies/:id (GET) - Get Deleted Company Should Fail', () => {
        return request(app.getHttpServer())
            .get(`/companies/${testCompanyId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(404);
    });
});
