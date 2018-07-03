import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

let connectionString;

// set database for environment
if (process.env.NODE_ENV === 'test') {
    connectionString = process.env.TEST_DATABASE_URL;
} else {
    connectionString = process.env.DATABASE_URL;
}

const connectionPool = new Pool({ connectionString });

export default connectionPool;
