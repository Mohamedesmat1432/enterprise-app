const { Client } = require('pg');
require('dotenv').config();

async function run() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'P@ssw0rd',
        database: process.env.DB_DATABASE || 'enterprise_db',
    });

    try {
        await client.connect();
        console.log('Nuking database...');
        await client.query('DROP SCHEMA public CASCADE');
        await client.query('CREATE SCHEMA public');
        await client.query('GRANT ALL ON SCHEMA public TO postgres');
        await client.query('GRANT ALL ON SCHEMA public TO public');
        console.log('Done.');
        await client.end();
    } catch (err) {
        console.error('Failed:', err.message);
    }
}

run();
