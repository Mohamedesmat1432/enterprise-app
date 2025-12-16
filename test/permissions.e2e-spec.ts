import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/roles/entities/role.entity';
import { Permission } from '../src/permissions/entities/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from '../src/permissions/dto/create-permission.dto';

describe('PermissionsController (e2e)', () => {
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
        await app.get(getRepositoryToken(Permission)).query(`DELETE FROM "permission"`);

        // Create Admin Role
        const adminRole = await roleRepo.save({ name: 'Admin', description: 'Administrator' });

        // Create Admin User
        const adminUser = await userRepo.save(userRepo.create({
            name: 'Admin User',
            email: 'admin-perms@example.com',
            password: 'password',
            age: 30,
            roles: [adminRole]
        }));

        // Login
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin-perms@example.com', password: 'password' });

        adminToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/permissions (POST) - Create Permission', () => {
        const dto: CreatePermissionDto = {
            slug: 'create-post',
            description: 'Can create posts'
        };
        return request(app.getHttpServer())
            .post('/permissions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dto)
            .expect((res) => {
                if (res.status !== 201) {
                    console.error('Status:', res.status);
                    console.error('Error Body:', JSON.stringify(res.body, null, 2));
                }
                expect(res.status).toBe(201);
                expect(res.body.slug).toBe(dto.slug);
            });
    });

    it('/permissions (POST) - Create Duplicate Permission should fail', () => {
        const dto: CreatePermissionDto = {
            slug: 'create-post',
            description: 'Duplicate'
        };
        return request(app.getHttpServer())
            .post('/permissions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dto)
            .expect(409); // Conflict
    });
});
