const http = require('http');
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const API_PORT = 3000;
const API_HOST = 'localhost';

function request(options, body) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    if (res.statusCode >= 400) reject({ status: res.statusCode, data: parsed });
                    else resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function verify() {
    try {
        const email = `audit-test-${Date.now()}@example.com`;
        console.log('--- 1. Register ---');
        await request({
            hostname: API_HOST,
            port: API_PORT,
            path: '/v1/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Audit Master',
            email: email,
            password: 'StrongPassword123!',
            age: 30
        });
        console.log('Registration successful.');

        console.log('--- 2. Login ---');
        const loginRes = await request({
            hostname: API_HOST,
            port: API_PORT,
            path: '/v1/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            email: email,
            password: 'StrongPassword123!'
        });

        const token = loginRes.data.access_token;
        console.log('Login successful.');

        const authHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        console.log('--- 2. Create Warehouse ---');
        const createRes = await request({
            hostname: API_HOST,
            port: API_PORT,
            path: '/v1/inventory/warehouses',
            method: 'POST',
            headers: authHeaders
        }, {
            name: 'Audit Test Warehouse',
            code: 'ATW-' + Date.now(),
            address: '123 Audit St'
        });
        const warehouseId = createRes.data.id;
        console.log('Warehouse created:', warehouseId);

        console.log('--- 3. Update Warehouse ---');
        await request({
            hostname: API_HOST,
            port: API_PORT,
            path: `/v1/inventory/warehouses/${warehouseId}`,
            method: 'PATCH',
            headers: authHeaders
        }, {
            name: 'Updated Warehouse Name'
        });
        console.log('Warehouse updated.');

        console.log('--- 4. Delete Warehouse ---');
        await request({
            hostname: API_HOST,
            port: API_PORT,
            path: `/v1/inventory/warehouses/${warehouseId}`,
            method: 'DELETE',
            headers: authHeaders
        });
        console.log('Warehouse deleted.');

        console.log('--- 5. Verify Database Audit Logs ---');
        const client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'P@ssw0rd',
            database: process.env.DB_DATABASE || 'enterprise_db',
        });
        await client.connect();
        const res = await client.query('SELECT action, entity, changes FROM audit_logs WHERE entity_id = $1 ORDER BY created_at ASC', [warehouseId]);
        console.log('Audit Logs for Warehouse:', JSON.stringify(res.rows, null, 2));
        await client.end();

        if (res.rows.length === 3) {
            console.log('SUCCESS: Captured All 3 actions (INSERT, UPDATE, DELETE)');

            const updateLog = res.rows[1];
            if (updateLog.changes.name && updateLog.changes.name.before === 'Audit Test Warehouse' && updateLog.changes.name.after === 'Updated Warehouse Name') {
                console.log('SUCCESS: State-diff for UPDATE is accurate!');
            } else {
                console.log('FAILURE: State-diff for UPDATE is incorrect or missing:', updateLog.changes);
            }
        } else {
            console.log('FAILURE: Expected 3 audit logs, found', res.rows.length);
        }

    } catch (err) {
        console.error('Verification failed:', err);
    }
}

verify();
