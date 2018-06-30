import { Pool } from 'pg';

const connectionString = 'postgresql://king:pass@localhost:5432/ridemyway';
const connectionPool = new Pool({ connectionString });

export default connectionPool;
