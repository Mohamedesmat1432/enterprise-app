import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth/register (POST)', () => {
        const email = `test-${Date.now()}@example.com`;
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'Test User',
                email: email,
                password: 'password',
                age: 25,
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.email).toEqual(email);
            });
    });

    it('/auth/login (POST)', async () => {
        const email = `login-${Date.now()}@example.com`;
        // Register first
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'Login User',
                email: email,
                password: 'password',
                age: 30,
            });

        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: email,
                password: 'password',
            })
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
                expect(res.body.user).toHaveProperty('email', email);
            });
    });
});
