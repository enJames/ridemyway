import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

let connectionString;
let ssl;

// set database for environment
if (process.env.NODE_ENV === 'test') {
    connectionString = process.env.TEST_DATABASE_URL;
    ssl = true;
} else {
    connectionString = process.env.DATABASE_URL;
    ssl = false;
}

const connectionPool = new Pool({ connectionString, ssl });

export default connectionPool;
