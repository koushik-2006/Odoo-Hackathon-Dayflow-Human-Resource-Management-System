import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'dayflow',
  user: process.env.DB_USERNAME || process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection silently or report status
export async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, current_database() as db_name;');
    console.log(`✅ PostgreSQL Connected to database "${result.rows[0].db_name}" at ${result.rows[0].current_time}`);
    client.release();
    return true;
  } catch (err) {
    console.warn(`⚠️ PostgreSQL database connection pending/unreachable (${err.message}). Using initial dataset.`);
    return false;
  }
}

export default pool;
