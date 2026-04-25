# FighTea — Milk Tea Shop Ordering System

**Version 5.0 · Production-Ready Full-Stack Guide**

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Part 1 — Database Setup (MySQL)](#part-1--database-setup-mysql)
3. [Part 2 — Backend Setup (Node.js)](#part-2--backend-setup-nodejs)
4. [Part 3 — Frontend Setup](#part-3--frontend-setup)
5. [Part 4 — Deploy Backend to Vercel](#part-4--deploy-backend-to-vercel)
6. [Part 5 — Deploy Frontend to Vercel](#part-5--deploy-frontend-to-vercel)
7. [Part 6 — Connect Hostinger Domain](#part-6--connect-hostinger-domain)
8. [Part 7 — Admin First-Time Setup](#part-7--admin-first-time-setup)
9. [Troubleshooting](#troubleshooting)
10. [API Reference](#api-reference)

---

## Project Structure

```
FighTea_v5/
├── frontend/
│   ├── html/index.html         Single-page application (all views + modals)
│   ├── css/style.css           Beige design system, fully responsive
│   ├── js/
│   │   ├── data.js             App state, menu data, analytics helpers
│   │   ├── app.js              Auth, menu, cart, checkout, GCash logic
│   │   ├── admin.js            Dashboard: queue, menu CRUD, promos, users
│   │   └── notifications.js    Customer order-ready popup (SSE + polling)
│   ├── assets/logo.png         Shop logo
│   ├── vercel.json             Vercel routing config for static site
│   └── package.json
│
├── backend/
│   ├── server.js               Express entry point
│   ├── package.json            Dependencies
│   ├── .env.example            Copy to .env and fill in real values
│   ├── vercel.json             Vercel serverless config
│   ├── config/db.js            MySQL connection pool
│   ├── middleware/auth.js      JWT auth middleware
│   ├── routes/                 auth · menu · orders · users · analytics · notifications
│   ├── controllers/            authController · menuController · orderController
│   │                           userController · analyticsController · notificationController
│   └── database/
│       ├── schema.sql          ALL table definitions — run this first
│       ├── inventory.sql       Default size and ice options
│       └── users.sql           Default admin account
│
└── README.md                   This file
```

---

## Part 1 — Database Setup (MySQL)

### Prerequisites

- MySQL **5.7 or 8.x** installed on your machine
- MySQL running as a service
- Access to the `mysql` command-line tool

**Check MySQL is running:**
```cmd
mysql --version
```
If you see a version number, MySQL is installed. If not, download it from
https://dev.mysql.com/downloads/installer/ (Windows) or use `brew install mysql` (Mac).

---

### Step 1 — Open a terminal in your project folder

```cmd
cd C:\Projects\FighTea_v5
```

---

### Step 2 — Create the database and all tables

Run this command. You will be asked for your MySQL root password:

```cmd
mysql -u root -p < backend/database/schema.sql
```

Type your password and press Enter.

**What this does:**
- Creates the `fightea_db` database if it does not already exist
- Creates all 15 tables: users, categories, products, product_varieties,
  size_options, ice_options, toppings, promos, promo_items, orders,
  order_items, order_item_toppings, order_status_log, payments, sessions
- Every statement uses `IF NOT EXISTS` — safe to run multiple times

**Expected output:** No output means success. If you see `ERROR`, see the
Troubleshooting section below.

---

### Step 3 — Load default size and ice options

```cmd
mysql -u root -p < backend/database/inventory.sql
```

This inserts Small/Medium/Large sizes and Normal/Less Ice/No Ice/Warm ice options.
Uses `INSERT IGNORE` — safe to run multiple times.

---

### Step 4 — Generate your admin password hash

The admin password is stored as a bcrypt hash for security. You must generate
a real hash before importing the admin account.

**First, install dependencies** (do this in the backend folder):
```cmd
cd backend
npm install
```

**Then generate the hash for your chosen password:**
```cmd
node -e "require('bcrypt').hash('admin123',12).then(h=>console.log(h))"
```

You will see output like:
```
$2b$12$AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz12
```

Copy the entire hash string (starts with `$2b$12$`).

---

### Step 5 — Update users.sql with your real hash

Open `backend/database/users.sql` in any text editor (Notepad, VS Code, etc.).

Find this line:
```sql
'$2b$12$REPLACE_THIS_WITH_YOUR_REAL_BCRYPT_HASH',
```

Replace it with your hash. Example:
```sql
'$2b$12$AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz12',
```

Save the file.

---

### Step 6 — Import the admin account

```cmd
cd C:\Projects\FighTea_v5
mysql -u root -p < backend/database/users.sql
```

---

### Step 7 — Verify everything was created correctly

```cmd
mysql -u root -p fightea_db
```

Once inside MySQL, run:
```sql
SHOW TABLES;
```

You should see 15 tables. Then check the admin user:
```sql
SELECT id, full_name, email, role FROM users;
```

Expected output:
```
+----+--------------+-------------------+-------+
| id | full_name    | email             | role  |
+----+--------------+-------------------+-------+
|  1 | FighTea Admin| admin@fightea.com | admin |
+----+--------------+-------------------+-------+
```

Type `EXIT;` to leave MySQL.

---

## Part 2 — Backend Setup (Node.js)

### Prerequisites

- Node.js **18 or newer**
- Download from: https://nodejs.org (choose the LTS version)

Check you have it:
```cmd
node --version
npm --version
```

---

### Step 1 — Install dependencies

```cmd
cd C:\Projects\FighTea_v5\backend
npm install
```

This installs: `express`, `mysql2`, `bcrypt`, `jsonwebtoken`, `cors`, `dotenv`
Dev dependency: `nodemon` (auto-restarts server when you change files)

---

### Step 2 — Create your environment file

```cmd
copy .env.example .env
```

Open `.env` in a text editor and fill in every value:

```env
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password_here
DB_NAME=fightea_db

JWT_SECRET=replace_with_a_long_random_string_at_least_64_chars
FRONTEND_URL=http://localhost:3000
```

**Generate a secure JWT_SECRET** (run this once and paste the output):
```cmd
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

### Step 3 — Start the backend server

```cmd
npm run dev
```

You should see:
```
✅ MySQL connected to fightea_db
🧋 FighTea API running → http://localhost:4000
   Environment : development
   Frontend URL: http://localhost:3000
```

If you see a MySQL connection error, double-check your `.env` file.
Make sure `DB_PASS` matches your MySQL root password exactly.

---

### Step 4 — Test the backend is working

Open a new terminal window and run:

```cmd
curl http://localhost:4000/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

Test login:
```cmd
curl -X POST http://localhost:4000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@fightea.com\",\"password\":\"admin123\"}"
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {"id":1,"name":"FighTea Admin","role":"admin"}
}
```

If you get `Invalid email or password`, the bcrypt hash in `users.sql`
was not generated for the password you typed in the curl command.
Re-generate the hash for the exact password you want to use and re-import.

---

## Part 3 — Frontend Setup

### Step 1 — Set the API base URL

Open `frontend/js/data.js` in a text editor. Near the top you will find:

```js
// ── API base URL — change this before deploying ──
window.FIGHTEA_API_BASE = 'http://localhost:4000/api';
```

This line is in `frontend/html/index.html` in the inline `<script>` block.
For local development, keep it as `http://localhost:4000/api`.

---

### Step 2 — Open the frontend

Open `frontend/html/index.html` directly in your browser:

```
File → Open → C:\Projects\FighTea_v5\frontend\html\index.html
```

Or if you have VS Code with Live Server extension, right-click
`index.html` → Open with Live Server.

---

### Step 3 — Test the full local flow

1. Click **Sign In**
2. Enter `admin@fightea.com` and the password you set
3. You should be redirected to the Admin Dashboard
4. Go to **Menu Manager** → add a Category, then a Drink
5. Go back to the main page → click **Menu** → you should see your drink
6. Click the drink → customize → add to cart → checkout

This confirms the frontend and backend are correctly connected.

---

## Part 4 — Deploy Backend to Vercel

Vercel deploys the backend as a serverless Node.js function.

### Prerequisites

- A Vercel account at https://vercel.com (free)
- A hosted MySQL database (see options below)

---

### Step A — Get a hosted MySQL database

You cannot use your local MySQL in production. Choose one:

**Option 1: PlanetScale** (recommended, generous free tier)
1. Go to https://planetscale.com → Sign Up
2. Create a new database → name it `fightea_db`
3. Click **Connect** → choose **Node.js**
4. Copy the host, username, and password shown

> Note: PlanetScale disables foreign keys by default. The schema still works
> because `InnoDB` referential integrity is handled at the application layer.
> If you get FK errors, that is why — ignore them for PlanetScale.

**Option 2: Railway** (supports foreign keys, very easy)
1. Go to https://railway.app → Login with GitHub
2. New Project → Add a Service → Database → MySQL
3. Click the MySQL service → Variables tab
4. Copy `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`

**Option 3: Clever Cloud** (European, free hobby plan)
1. Go to https://console.clever-cloud.com
2. Create → Add-on → MySQL

---

### Step B — Import your schema to the hosted database

**For PlanetScale** — use their web console or CLI:
```cmd
pscale shell fightea_db main < backend/database/schema.sql
pscale shell fightea_db main < backend/database/inventory.sql
pscale shell fightea_db main < backend/database/users.sql
```

**For Railway** — connect via any MySQL client using the credentials from
the Variables tab, then run the SQL files.

**For any host** — you can use a MySQL GUI like TablePlus or MySQL Workbench:
1. Connect using the host credentials
2. Open the Query window
3. Paste the contents of `schema.sql` and run it
4. Then paste and run `inventory.sql`
5. Then paste and run `users.sql`

---

### Step C — Install Vercel CLI

```cmd
npm install -g vercel
```

---

### Step D — Deploy the backend

```cmd
cd C:\Projects\FighTea_v5\backend
vercel
```

Answer the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → select your account
- **Link to existing project?** → N
- **Project name?** → `fightea-api`
- **In which directory is your code?** → `.` (press Enter)
- **Override settings?** → N

Vercel will give you a URL like `https://fightea-api.vercel.app`.

---

### Step E — Set environment variables on Vercel

Go to https://vercel.com → Dashboard → `fightea-api` → Settings → Environment Variables.

Add each of these (use your hosted database values):

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DB_HOST` | your hosted DB host |
| `DB_PORT` | `3306` (or your DB's port) |
| `DB_USER` | your hosted DB username |
| `DB_PASS` | your hosted DB password |
| `DB_NAME` | `fightea_db` |
| `JWT_SECRET` | the same 96-char hex string from your local .env |
| `FRONTEND_URL` | `https://fightea.vercel.app` (update after Step F) |

Click **Save** after adding all variables.

---

### Step F — Redeploy with environment variables

```cmd
vercel --prod
```

Test your live API:
```cmd
curl https://fightea-api.vercel.app/api/health
```

---

## Part 5 — Deploy Frontend to Vercel

### Step A — Update the API base URL in the frontend

Open `frontend/html/index.html`. Find this line near the bottom:

```js
window.FIGHTEA_API_BASE = 'http://localhost:4000/api';
```

Change it to your live backend URL:

```js
window.FIGHTEA_API_BASE = 'https://fightea-api.vercel.app/api';
```

Save the file.

---

### Step B — Deploy the frontend

```cmd
cd C:\Projects\FighTea_v5\frontend
vercel
```

Answer the prompts:
- **Project name?** → `fightea`
- **Which directory?** → `.` (press Enter)
- **Override settings?** → N

Vercel gives you a URL like `https://fightea.vercel.app`.

---

### Step C — Update CORS on the backend

Go to Vercel → `fightea-api` → Settings → Environment Variables.

Update `FRONTEND_URL` to `https://fightea.vercel.app`.

Then redeploy the backend:
```cmd
cd C:\Projects\FighTea_v5\backend
vercel --prod
```

---

### Step D — Test the live site

1. Open `https://fightea.vercel.app`
2. Click **Sign In** → enter your admin credentials
3. You should land on the Admin Dashboard
4. Add a category, add a drink, go to Menu → confirm it appears

---

## Part 6 — Connect Hostinger Domain

This connects your Hostinger domain (e.g. `www.yourdomain.com`) to your
Vercel-hosted frontend.

---

### Step A — Add the domain to Vercel

1. Go to https://vercel.com → Dashboard → `fightea` project
2. Click **Settings** → **Domains**
3. Type `yourdomain.com` → click **Add**
4. Also add `www.yourdomain.com`

Vercel will show you the DNS records you need to add. Keep this tab open.

---

### Step B — Update DNS on Hostinger

1. Log in to https://hpanel.hostinger.com
2. Click **Domains** → click your domain name
3. Click **DNS / Nameservers** → **Manage DNS Records**
4. Delete any existing `A` record for `@` (the root domain)
5. Add the following two records exactly as shown:

| Type | Name | Value (Points To) | TTL |
|------|------|-------------------|-----|
| `A` | `@` | `76.76.21.21` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com.` | 3600 |

6. Click **Save Changes**

DNS changes take between 15 minutes and 48 hours to propagate worldwide.

---

### Step C — Wait for SSL certificate

Once DNS propagates, Vercel automatically issues a free SSL certificate.
You do not need to do anything — the padlock appears automatically.

---

### Step D — Update FRONTEND_URL on Vercel

After your domain is live:

1. Go to Vercel → `fightea-api` → Settings → Environment Variables
2. Update `FRONTEND_URL` to `https://www.yourdomain.com`
3. Redeploy backend: in your terminal run:

```cmd
cd C:\Projects\FighTea_v5\backend
vercel --prod
```

---

### Step E — Update API_BASE in frontend (if using custom API domain)

If you also added a domain like `api.yourdomain.com` to your backend:

Add a `CNAME` record on Hostinger:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `api` | `cname.vercel-dns.com.` | 3600 |

Then in `frontend/html/index.html` update:
```js
window.FIGHTEA_API_BASE = 'https://api.yourdomain.com/api';
```

Redeploy the frontend:
```cmd
cd C:\Projects\FighTea_v5\frontend
vercel --prod
```

---

## Part 7 — Admin First-Time Setup

After deploying, log in and configure the system through the dashboard.

**Do this in order:**

1. **Log in** at your live site using `admin@fightea.com` and your password
2. **Categories** → Menu Manager → Categories → **+ Add Category**
   Add: Milk Tea, Fruit Tea, Specialty, Coffee, Food (or whatever your shop sells)
3. **Sizes** → Menu Manager → Sizes → **+ Add Size**
   Add: Small (₱0 add-on), Medium (₱0 add-on), Large (₱20 add-on)
   > Only check "Enable Sizes" for drink items — leave unchecked for food
4. **Toppings** → Menu Manager → Toppings → **+ Add Topping**
   Add: Tapioca Pearls, Pudding, Popping Boba, etc. (set price per topping)
5. **Menu Items** → Menu Manager → **+ Add Item**
   For each drink: fill in name, category, price, description, upload photo,
   check "Enable Sizes", mark as Bestseller if featured
6. **Promos** → Promos tab → **+ Add Promo**
   Set name, badge label, description, and assign items with promo prices
7. **GCash Number** → Settings tab → update with your real GCash number
8. **Staff Accounts** → Users tab → **+ Add User** → Role: Staff
9. **Change Admin Password** → Users tab → Edit the admin user

---

## Troubleshooting

### MySQL Errors

**ERROR 1064 — SQL syntax error near `IF NOT EXISTS` in ALTER TABLE**

This was a bug in older versions of this project. The schema has been fixed.
`ALTER TABLE ... ADD COLUMN IF NOT EXISTS` is not supported in MySQL.
The current `schema.sql` defines all columns inside `CREATE TABLE` statements.

Fix: Delete the database and re-run the schema:
```cmd
mysql -u root -p -e "DROP DATABASE IF EXISTS fightea_db;"
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/inventory.sql
mysql -u root -p < backend/database/users.sql
```

---

**ERROR 1062 — Duplicate entry for key**

This happens when you run `users.sql` or `inventory.sql` more than once.
Both files use `INSERT IGNORE` — this error should not occur.

If it still appears, the table already has a conflicting row.
Check with:
```cmd
mysql -u root -p fightea_db -e "SELECT email FROM users;"
```

If the admin row already exists, the import was already successful.
You do not need to re-run `users.sql`.

---

**ERROR 1215 — Cannot add foreign key constraint**

Cause: Tables are being created in the wrong order, or a referenced table
doesn't exist yet.

Fix: Run `schema.sql` as a whole file — do not paste individual sections.
The tables are defined in dependency order in the file.

---

**ERROR 1292 — Incorrect date value: 'CURRENT_DATE'**

This is fixed in the current schema. The `orders` table previously used
`DEFAULT (CURRENT_DATE)` which is only valid in MySQL 8.0.13+.
The current schema has `order_date DATE NOT NULL` with no default expression.
The application now supplies the date when inserting.

---

**ERROR 1045 — Access denied for user 'root'@'localhost'**

Your MySQL password is wrong. Try logging in manually:
```cmd
mysql -u root -p
```
If that fails, you need to reset your MySQL root password.

---

**MySQL service not running (Windows)**

Open Services (press Windows+R → type `services.msc`) and find
`MySQL80` or `MySQL57`. Right-click → Start.

Or from Command Prompt as Administrator:
```cmd
net start MySQL80
```

---

### Backend / Node.js Errors

**Error: connect ECONNREFUSED 127.0.0.1:3306**

MySQL is not running. Start it (see above), then restart the backend.

---

**Error: Cannot find module 'express'**

You forgot to run `npm install`. Run it inside the `backend` folder:
```cmd
cd C:\Projects\FighTea_v5\backend
npm install
```

---

**Error: secretOrPrivateKey must have a value**

Your `JWT_SECRET` is empty or missing in `.env`. Open `.env` and add:
```
JWT_SECRET=your_long_random_string_here
```

---

**JsonWebTokenError: invalid signature**

The `JWT_SECRET` in your `.env` changed after tokens were issued.
Users need to log in again to get a new token.

---

**TokenExpiredError: jwt expired**

Tokens expire after 8 hours. The user needs to log in again.

---

**Port 4000 already in use**

Another process is using port 4000. Either:
- Change `PORT=4001` in your `.env`, or
- Kill the process using the port:
```cmd
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F
```

---

### CORS Errors

**Access to fetch blocked by CORS policy**

The `FRONTEND_URL` in your `.env` (or Vercel env variables) does not match
the origin your browser is making requests from.

Rules:
- No trailing slash: `https://fightea.vercel.app` ✅  — `https://fightea.vercel.app/` ❌
- Must match exactly including `https://` vs `http://`
- For local dev: `FRONTEND_URL=http://localhost:3000`
- For live site: `FRONTEND_URL=https://yourdomain.com`

After changing env variables on Vercel, you must redeploy:
```cmd
cd backend
vercel --prod
```

---

**CORS error only on the `/notifications/stream` endpoint**

SSE (Server-Sent Events) requires CORS preflight to allow the
`text/event-stream` content type. The `server.js` already includes:
```js
allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
```

If you are still getting errors, the notification system automatically
falls back to polling after 12 seconds. No action needed.

---

### Vercel Deployment Errors

**Cannot find module — build fails on Vercel**

Make sure `package.json` and `package-lock.json` are both committed to Git.
Do not add `node_modules/` to Git.

Check your `.gitignore`:
```
node_modules/
.env
```

---

**Environment variables missing on Vercel**

Variables set in `.env` are NOT automatically sent to Vercel.
You must add each one manually in:
Vercel Dashboard → Project → Settings → Environment Variables

After adding variables, you must redeploy:
```cmd
vercel --prod
```

---

**Vercel function timeout (504 error)**

Vercel free plan serverless functions have a 10-second timeout.
If a database query is slow, it may time out.

Fix options:
1. Add indexes to frequently queried columns (already done in `schema.sql`)
2. Upgrade to Vercel Pro plan (60-second timeout)
3. Move the backend to Railway which runs as a persistent server

---

**DATABASE connection refused from Vercel**

Your hosted database (PlanetScale, Railway, etc.) may block connections
from unknown IP addresses.

For PlanetScale: connections are allowed from all IPs by default.

For Railway MySQL: go to your MySQL service settings and ensure it is
accessible from external connections.

For Hostinger MySQL (if you have web hosting): go to hPanel → Databases →
Remote MySQL and add `0.0.0.0` (allow all) or Vercel's IP ranges.

---

### Domain / DNS Issues

**Domain still shows old website after updating DNS**

DNS propagation takes up to 48 hours. You can check real-time propagation at:
https://dnschecker.org → enter your domain → check the A record

---

**SSL padlock not showing**

Vercel automatically provisions SSL once it verifies your DNS records are
pointing correctly. This happens within minutes of DNS propagating.
If it doesn't appear after 24 hours, go to Vercel → Settings → Domains
and click **Refresh** on your domain.

---

## API Reference

All API endpoints use JSON. Protected endpoints require:
```
Authorization: Bearer <your_jwt_token>
```

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | None | Login, returns JWT |
| POST | `/api/auth/register` | None | Register customer |
| GET | `/api/auth/me` | Any | Get current user |
| GET | `/api/menu/categories` | None | List categories |
| POST | `/api/menu/categories` | Admin | Create category |
| PUT | `/api/menu/categories/:id` | Admin | Rename category |
| DELETE | `/api/menu/categories/:id` | Admin | Delete category |
| GET | `/api/menu/products` | None | Get menu items |
| POST | `/api/menu/products` | Admin | Add product |
| PUT | `/api/menu/products/:id` | Admin | Update product |
| DELETE | `/api/menu/products/:id` | Admin | Delete product |
| GET | `/api/menu/sizes` | None | Get sizes |
| POST | `/api/menu/sizes` | Admin | Add size |
| PUT | `/api/menu/sizes/:id` | Admin | Edit size |
| DELETE | `/api/menu/sizes/:id` | Admin | Delete size |
| GET | `/api/menu/toppings` | None | Get toppings |
| POST | `/api/menu/toppings` | Admin | Add topping |
| PUT | `/api/menu/toppings/:id` | Admin | Edit topping |
| DELETE | `/api/menu/toppings/:id` | Admin | Delete topping |
| GET | `/api/menu/promos` | None | Get promos |
| POST | `/api/menu/promos` | Admin | Create promo |
| PUT | `/api/menu/promos/:id` | Admin | Edit promo |
| DELETE | `/api/menu/promos/:id` | Admin | Delete promo |
| POST | `/api/orders` | Any | Place order |
| GET | `/api/orders?status=` | Staff/Admin | Get orders |
| PATCH | `/api/orders/:id/status` | Staff/Admin | Update status |
| PUT | `/api/orders/:id` | Staff/Admin | Edit order |
| GET | `/api/users` | Admin | List users |
| POST | `/api/users` | Admin | Create user |
| PUT | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |
| GET | `/api/analytics/summary` | Admin | Revenue + stats |
| GET | `/api/notifications/stream` | Any | SSE stream |
| GET | `/api/notifications/poll` | Any | Polling fallback |
| GET | `/api/health` | None | Health check |

---

## Security Checklist

Before going live, confirm all of these:

- [ ] Changed admin password from the default — edit the user in the Dashboard
- [ ] Replaced `$2b$12$REPLACE_THIS...` placeholder in `users.sql` with a real bcrypt hash
- [ ] Generated a unique `JWT_SECRET` (at least 64 characters)
- [ ] Set `NODE_ENV=production` in Vercel environment variables
- [ ] Set `FRONTEND_URL` to your exact live domain (no trailing slash)
- [ ] HTTPS is enabled on your domain (Vercel handles this automatically)
- [ ] `.env` file is in `.gitignore` and never pushed to Git
- [ ] Hosted database credentials are not hard-coded anywhere in source files

