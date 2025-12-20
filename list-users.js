const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function check() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'P@ssw0rd',
        database: process.env.DB_DATABASE || 'enterprise_db',
    });

    try {
        await client.connect();
        const res = await client.query('SELECT id, email, name FROM "user"');
        console.log('Users:', res.rows);
        await client.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

check();
