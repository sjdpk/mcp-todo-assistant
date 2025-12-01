import { Pool } from 'pg'
import {config} from './env.js';

// Create a connection pool using environment variables
export const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,  
  password:config.db.password,
  port: config.db.port,
});


// A simple check to ensure the connection works
pool.on('connect', () => console.log('PostgreSQL connected.'));
pool.on('error',(err)=> console.error('PostgreSQL connection error.',err));