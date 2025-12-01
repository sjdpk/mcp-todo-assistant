import { Pool } from "pg";
import { config } from './env.js';


export const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

// Connection event handlers
pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

export async function closeDbPool() {
    await pool.end();
    console.log('PostgreSQL pool has been closed');
}