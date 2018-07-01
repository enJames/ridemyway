import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const connectionPool = new Pool({ connectionString });

export default connectionPool;
