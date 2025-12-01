# Check PostgreSQL:
```bash
postgres --version
```

# Run postgresql server
```bash
brew services start postgresql@14
```

# check service is running or not
```bash
brew servie list | grep postgresql
```

# User & Permisson
```sql
CREATE USER todo_user WITH PASSWORD 'todo';

-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;

-- Grant privileges on schema
GRANT ALL ON SCHEMA public TO todo_user;

-- Grant privileges on all tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todo_user;
```

# Connect as new user
```bash
psql -U todo_user -d todo_app -h localhost
```


# PostgreSQL
```sql
psql postgres

-- reate Database
CREATE DATABASE todo_app;

-- List all databases
\l

-- Connect to the database
\c todo_app

-- List all users
\du

-- List all tables
\dt

-- Check the table details
\d table_name

-- Exit PostgreSQL
\q
```

# Drop user/database (if needed)
```sql
DROP DATABASE todo_app;
DROP USER todo_user;
```