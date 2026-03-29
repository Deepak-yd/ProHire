# ProHire Backend

Node.js + Express API backed by MySQL using Sequelize ORM.

## Prerequisites

- **Node.js** v14+ 
- **MySQL Server** (5.7 or higher, or MySQL 8.0+)
- **npm** or **yarn**

## Database Setup

### Option 1: Automated Setup (Windows)

**Using PowerShell:**
```powershell
.\setup-mysql.ps1
```

**Using Command Prompt:**
```cmd
setup-mysql.bat
```

These scripts will:
- Verify MySQL installation
- Create `prohire` database
- Configure initial schema

### Option 2: Manual Setup

1. Install MySQL from: https://dev.mysql.com/downloads/mysql/
2. Open MySQL command line:
   ```bash
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS prohire;
   USE prohire;
   ```

## Application Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy `.env.example` if available):
   ```env
   PORT=5000
   DATABASE_URL=mysql://root:your_password@localhost:3306/prohire
   JWT_SECRET=your_jwt_secret_here
   ```
   Replace `your_password` with your MySQL root password.

3. Test database connection:
   ```bash
   npm run test:db
   ```
   Expected output: ✅ Connection successful!

4. Seed initial data (optional - runs automatically on first startup if database is empty):
   ```bash
   npm run seed
   ```

5. Start server in development:
   ```bash
   npm run dev
   ```
   Expected: `Database connected. Server running on port 5000`

## Troubleshooting

### Connection Issues

**Error: `connect ECONNREFUSED`**
- MySQL server is not running
- **Fix:** Start MySQL service (see MYSQL_SETUP_GUIDE.md)

**Error: `ER_ACCESS_DENIED_ERROR`**
- Wrong MySQL password in `.env`
- **Fix:** Verify password and update DATABASE_URL

**Error: `ER_BAD_DB_ERROR` or `Unknown database 'prohire'`**
- Database not created yet
- **Fix:** Run setup script or create manually (see Database Setup section above)

### Detailed Help

For comprehensive MySQL setup, troubleshooting, and backup/restore procedures, refer to [MYSQL_SETUP_GUIDE.md](../MYSQL_SETUP_GUIDE.md).

## API Documentation
- `POST /api/auth/register` - create user
- `POST /api/auth/login` - authenticate
- `GET /api/professionals` - list professionals
- `POST /api/professionals` - create new professional
- `GET /api/hires` / `POST /api/hires`
- `GET /api/messages` / `POST /api/messages`
- **Connections**
  - `POST /api/connections` – send request (body: `{ email | username }`)
  - `GET /api/connections/incoming` – incoming pending requests
  - `GET /api/connections/sent` – requests you have sent
  - `PUT /api/connections/:id/accept` – accept request
  - `PUT /api/connections/:id/reject` – reject request
  - `GET /api/connections/friends` – list accepted connections

For protected endpoints, add `Authorization: Bearer <token>` header.

### Sample accounts (created when database is empty)

- **Admin** – admin@prohire.app / Admin@123
- **Professional** – ava@prohire.app / Pro@12345
- **User** – ethan@prohire.app / User@12345


Refer to the frontend project's README for client-side setup.
