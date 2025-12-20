import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('Golden Regression Tests (e2e)', () => {
    jest.setTimeout(30000);
    let app: INestApplication;
    let authToken: string;
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'StrongP@ss123!';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Mimic main.ts setup
        app.setGlobalPrefix('v1');
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }));

        await app.init();
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    describe('Authentication & Registration Flow', () => {
        it('should register a new user and create a company', async () => {
            const response = await request(app.getHttpServer())
                .post('/v1/auth/register')
                .send({
                    name: 'Test Admin',
                    email: testEmail,
                    password: testPassword,
                    age: 30
                });

            if (response.status !== 201) {
                console.error('Registration Failure:', JSON.stringify(response.body, null, 2));
            }

            expect(response.status).toBe(201);
            expect(response.body.email).toBe(testEmail);
            expect(response.body.activeCompanyId).toBeDefined();
        });

        it('should login and return a JWT token', async () => {
            const response = await request(app.getHttpServer())
                .post('/v1/auth/login')
                .send({
                    email: testEmail,
                    password: testPassword,
                });

            if (response.status !== 200) {
                console.error('Login Failure:', JSON.stringify(response.body, null, 2));
            }

            expect(response.status).toBe(200);
            expect(response.body.access_token).toBeDefined();
            authToken = response.body.access_token;
        });
    });

    describe('User Management', () => {
        it('should get all users', async () => {
            const response = await request(app.getHttpServer())
                .get('/v1/users')
                .set('Authorization', `Bearer ${authToken}`);

            if (response.status !== 200) {
                console.error('Get Users Failure:', JSON.stringify(response.body, null, 2));
            }

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
        });
    });

    describe('Dashboard', () => {
        it('should get dashboard stats', async () => {
            const response = await request(app.getHttpServer())
                .get('/v1/dashboard/stats')
                .set('Authorization', `Bearer ${authToken}`);

            if (response.status !== 200) {
                console.error('Dashboard Stats Failure:', JSON.stringify(response.body, null, 2));
            }

            expect(response.status).toBe(200);
        });
    });
});
