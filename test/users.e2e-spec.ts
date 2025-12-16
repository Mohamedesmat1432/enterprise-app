import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/roles/entities/role.entity';
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
            email: 'admin@example.com',
            password: 'password', // Will be hashed by entity listener
            age: 30,
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
                expect(Array.isArray(res.body)).toBeTruthy();
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
