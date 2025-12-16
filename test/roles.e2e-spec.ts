import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/roles/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../src/roles/dto/create-role.dto';

describe('RolesController (e2e)', () => {
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

        // Cleanup
        await userRepo.query(`DELETE FROM "user_roles_role"`);
        await userRepo.query(`DELETE FROM "user"`);
        await roleRepo.query(`DELETE FROM "role_permissions_permission"`);
        await roleRepo.query(`DELETE FROM "role"`);

        // Create Admin Role
        const adminRole = await roleRepo.save({ name: 'Admin', description: 'Administrator' });

        // Create Admin User
        const adminUser = await userRepo.save(userRepo.create({
            name: 'Admin User',
            email: 'admin-roles@example.com',
            password: 'password',
            age: 30,
            roles: [adminRole]
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
                expect(Array.isArray(res.body)).toBeTruthy();
                expect(res.body.length).toBeGreaterThanOrEqual(2); // Admin + Editor
            });
    });
});
