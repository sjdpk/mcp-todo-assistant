import { pool } from '../config/db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Migration {
    version: string;
    filename: string;
    description: string;
}

const migrations: Migration[] = [
    {
        version: '000',
        filename: '000_init_migrations.sql',
        description: 'Initialize migration tracking'
    },
    {
        version: '001',
        filename: '001_create_todos_table.sql',
        description: 'Create todos table'
    },
    {
        version: '002',
        filename: '002_create_chat_tables.sql',
        description: 'Create chat tables'
    }
];

async function ensureMigrationsTable(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
    const result = await pool.query('SELECT version FROM schema_migrations ORDER BY version');
    return new Set(result.rows.map(row => row.version));
}

async function applyMigration(migration: Migration): Promise<void> {
    const sqlPath = join(__dirname, migration.filename);
    const sql = readFileSync(sqlPath, 'utf-8');
    
    // Start transaction
    await pool.query('BEGIN');
    
    try {
        // Remove comments and split by semicolon
        const cleanSql = sql
            .split('\n')
            .filter(line => !line.trim().startsWith('--'))
            .join('\n');
        
        const statements = cleanSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
        
        // Execute each statement
        for (const statement of statements) {
            await pool.query(statement);
        }
        
        // Record migration
        await pool.query(
            'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING',
            [migration.version]
        );
        
        await pool.query('COMMIT');
        console.log(`Applied migration ${migration.version}: ${migration.description}`);
    } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
}

export async function runMigrations(): Promise<void> {
    try {
        console.log('🔄 Checking for pending migrations...');
        
        // Ensure migrations table exists
        await ensureMigrationsTable();
        
        // Get already applied migrations
        const appliedMigrations = await getAppliedMigrations();
        
        // Find pending migrations
        const pendingMigrations = migrations.filter(
            m => !appliedMigrations.has(m.version)
        );
        
        if (pendingMigrations.length === 0) {
            console.log('Database is up to date. No pending migrations.');
            return;
        }
        
        console.log(`📝 Found ${pendingMigrations.length} pending migration(s)`);
        
        // Apply each pending migration
        for (const migration of pendingMigrations) {
            await applyMigration(migration);
        }
        
        console.log('All migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// If running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
