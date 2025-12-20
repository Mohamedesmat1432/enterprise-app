const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'P@ssw0rd',
        database: process.env.DB_DATABASE || 'enterprise_db',
    });

    try {
        await client.connect();
        console.log('Connection successful!');
        const res = await client.query('SELECT current_database()');
        console.log('Database:', res.rows[0].current_database);
        await client.end();
    } catch (err) {
        console.error('Connection failed:', err.message);
    }
}

test();
