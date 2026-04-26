# FighTea — Milk Tea Shop Ordering System

<<<<<<< HEAD
**Version 5 · Production-Ready · Full-Stack Guide**

Complete Point-of-Sale and online ordering system for a milk tea shop.
Customers order and pay online. Staff manage orders in a live dashboard.
Admin controls the full menu, promos, users, and analytics.

---

## Quick Reference

| Thing | Value |
|-------|-------|
| Default admin email | `admin@fightea.com` |
| Default admin password | Set by you in Step 1-E |
| Backend port (local) | `4000` |
| Frontend port (local) | Opened directly as a file |
| API base URL (local) | `http://localhost:4000/api` |
| Health check URL | `http://localhost:4000/api/health` |
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728

---

## Project Structure

```
FighTea_v5/
├── frontend/
<<<<<<< HEAD
│   ├── html/index.html         Complete single-page application
│   ├── css/style.css           Beige design system, fully responsive
│   ├── js/
│   │   ├── data.js             API layer, state, session management
│   │   ├── app.js              Auth, menu, cart, checkout, GCash
│   │   ├── admin.js            Dashboard: queue, menu CRUD, promos, users
│   │   └── notifications.js    Customer order-ready popup (SSE + polling)
│   ├── assets/logo.png         Shop logo
│   ├── vercel.json             Vercel routing config
=======
│   ├── html/index.html         Single-page application (all views + modals)
│   ├── css/style.css           Beige design system, fully responsive
│   ├── js/
│   │   ├── data.js             App state, menu data, analytics helpers
│   │   ├── app.js              Auth, menu, cart, checkout, GCash logic
│   │   ├── admin.js            Dashboard: queue, menu CRUD, promos, users
│   │   └── notifications.js    Customer order-ready popup (SSE + polling)
│   ├── assets/logo.png         Shop logo
│   ├── vercel.json             Vercel routing config for static site
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
│   └── package.json
│
├── backend/
│   ├── server.js               Express entry point
<<<<<<< HEAD
│   ├── package.json
│   ├── .env.example            Template — copy to .env and fill in
│   ├── vercel.json             Vercel serverless config
│   ├── config/db.js            MySQL connection pool
│   ├── middleware/auth.js      JWT authentication middleware
│   ├── routes/                 auth, menu, orders, users, analytics, notifications
│   ├── controllers/            authController, menuController, orderController,
│   │                           userController, analyticsController, notificationController
│   └── database/
│       ├── schema.sql          All 15 tables — run this first
│       ├── inventory.sql       Default sizes and ice options
│       └── users.sql           Default admin account only
│
└── README.md
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
```

---

<<<<<<< HEAD
# PART 1 — DATABASE SETUP (MySQL)

## Prerequisites

- MySQL 5.7 or 8.x installed on your machine
- MySQL running as a service
- The `mysql` command available in your terminal or Command Prompt

Check MySQL is installed:
```
mysql --version
```

If MySQL is not installed:
- **Windows**: Download from https://dev.mysql.com/downloads/installer/ — choose "MySQL Installer"
- **Mac**: Run `brew install mysql` in Terminal, then `brew services start mysql`

---

## Step 1-A — Open a terminal in your project folder

Windows:
```
cd C:\Projects\FighTea_v5
```

Mac / Linux:
```
cd ~/Projects/FighTea_v5
```

---

## Step 1-B — Create all database tables

```
mysql -u root -p < backend/database/schema.sql
```

Enter your MySQL root password when asked.

**What this does:**
- Creates the database `fightea_db` if it does not exist
- Creates all 15 tables using `CREATE TABLE IF NOT EXISTS`
- Safe to run multiple times — will not duplicate or error

Expected result: No output means success. A blank prompt means it worked.

---

## Step 1-C — Load default size and ice options

```
mysql -u root -p < backend/database/inventory.sql
```

This inserts Small, Medium, Large sizes and Normal, Less Ice, No Ice, Warm ice options.
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
Uses `INSERT IGNORE` — safe to run multiple times.

---

<<<<<<< HEAD
## Step 1-D — Generate a bcrypt hash for your admin password

You must create a real bcrypt hash for your admin password.
Do this **before** importing the admin account.

First install Node.js dependencies (we need the bcrypt package):
```
cd backend
npm install
cd ..
```

Then generate the hash. Replace `YourChosenPassword` with the password
you want for the admin account:
```
cd backend
node -e "require('bcrypt').hash('admin123',12).then(h=>console.log(h))"
```

You will see one line of output like:
```
$2b$12$AbCdEfGhIjKlMnOpQrStUuVwXyZ012345678901234567890123456789
```

Copy that entire line including the `$2b$12$` at the start.

---

## Step 1-E — Put your hash into users.sql

Open `backend/database/users.sql` in any text editor.
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728

Find this line:
```sql
'$2b$12$REPLACE_THIS_WITH_YOUR_REAL_BCRYPT_HASH',
```

<<<<<<< HEAD
Replace it with your copied hash. Example:
```sql
'$2b$12$AbCdEfGhIjKlMnOpQrStUuVwXyZ012345678901234567890123456789',
=======
Replace it with your hash. Example:
```sql
'$2b$12$AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz12',
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
```

Save the file.

---

<<<<<<< HEAD
## Step 1-F — Import the admin account

```
=======
### Step 6 — Import the admin account

```cmd
cd C:\Projects\FighTea_v5
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
mysql -u root -p < backend/database/users.sql
```

---

<<<<<<< HEAD
## Step 1-G — Verify the database is correct

Connect to MySQL:
```
mysql -u root -p fightea_db
```

Run these two commands inside MySQL:
```sql
SHOW TABLES;
SELECT id, full_name, email, role FROM users;
```

`SHOW TABLES` should list 15 tables.
The SELECT should show one row: the admin account.
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728

Type `EXIT;` to leave MySQL.

---

<<<<<<< HEAD
## Troubleshooting — Database

**ERROR 1064: SQL syntax error near 'IF NOT EXISTS' in ALTER TABLE**

This was a bug in an older version. The current `schema.sql` does not use
`ALTER TABLE`. All columns are defined inside `CREATE TABLE` statements.

Fix — delete the database and re-import from scratch:
```
mysql -u root -p -e "DROP DATABASE IF EXISTS fightea_db;"
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/inventory.sql
mysql -u root -p < backend/database/users.sql
```

---

**ERROR 1062: Duplicate entry for key 'email'**

The admin account already exists. This is fine — `INSERT IGNORE` skips
the duplicate silently. You do not need to do anything.

---

**ERROR 1045: Access denied for user 'root'**

Your MySQL root password is wrong. Try connecting manually:
```
mysql -u root -p
```
If that fails, you need to reset your MySQL root password. Follow the
official MySQL guide for your operating system.

---

**ERROR 1292: Incorrect date value 'CURRENT_DATE'**

This was a bug in an older schema using `DEFAULT (CURRENT_DATE)`.
The current `schema.sql` does not use that syntax. If you see this error,
re-run the schema from scratch using the DROP command above.

---

**MySQL service not running on Windows**

Open Services: press `Windows + R`, type `services.msc`, press Enter.
Find `MySQL80` (or `MySQL57`). Right-click → Start.

Or from an Administrator Command Prompt:
```
net start MySQL80
```

---

**MySQL service not running on Mac**

```
brew services start mysql
```

---

# PART 2 — BACKEND SETUP (Node.js)

## Prerequisites

- Node.js version 18 or newer
- Download from: https://nodejs.org — choose the LTS version

Check you have it:
```
=======
## Part 2 — Backend Setup (Node.js)

### Prerequisites

- Node.js **18 or newer**
- Download from: https://nodejs.org (choose the LTS version)

Check you have it:
```cmd
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
node --version
npm --version
```

<<<<<<< HEAD
Both should show a version number.

---

## Step 2-A — Install backend dependencies

```
cd backend
=======
---

### Step 1 — Install dependencies

```cmd
cd C:\Projects\FighTea_v5\backend
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
npm install
```

This installs: `express`, `mysql2`, `bcrypt`, `jsonwebtoken`, `cors`, `dotenv`
<<<<<<< HEAD
Dev tool: `nodemon` (auto-restarts server on file changes)

---

## Step 2-B — Create your environment file

**Windows:**
```
copy .env.example .env
```

**Mac / Linux:**
```
cp .env.example .env
```

---

## Step 2-C — Fill in the .env file

Open `backend/.env` in any text editor. Fill in every value:
=======
Dev dependency: `nodemon` (auto-restarts server when you change files)

---

### Step 2 — Create your environment file

```cmd
copy .env.example .env
```

Open `.env` in a text editor and fill in every value:
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728

```env
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
<<<<<<< HEAD
DB_PASS=your_mysql_root_password_here
DB_NAME=fightea_db

JWT_SECRET=replace_this_with_a_long_random_string
FRONTEND_URL=http://localhost:3000
```

**Generating a secure JWT_SECRET:**

Run this command and paste the output as your `JWT_SECRET`:
```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

It produces 96 random hex characters, for example:
```
a1b2c3d4e5f6...long random string...
```

The `.env` file should look like this when filled in:
```env
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=mysql_password_here
DB_NAME=fightea_db
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
FRONTEND_URL=http://localhost:3000
```

Save the file.

---

## Step 2-D — Start the backend server

Make sure you are in the `backend` folder:
```
cd backend
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
npm run dev
```

You should see:
```
✅ MySQL connected to fightea_db
<<<<<<< HEAD
🧋 FighTea API  →  http://localhost:4000
   Mode        :  development
   Allowed origins: http://localhost:3000, http://localhost:4000, ...
```

If you see a MySQL connection error, double-check your `.env` file.
The `DB_PASS` must exactly match your MySQL root password.

Leave this terminal window open. The server must keep running.

---

## Step 2-E — Test the backend

Open a new terminal window and run:

```
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
curl http://localhost:4000/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

<<<<<<< HEAD
Test login with the admin account:
```
=======
Test login:
```cmd
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
curl -X POST http://localhost:4000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@fightea.com\",\"password\":\"admin123\"}"
```

<<<<<<< HEAD
(On Mac/Linux use single quotes around the -d value instead of ^ line continuation)

=======
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
<<<<<<< HEAD
  "user": { "id": 1, "name": "FighTea Admin", "role": "admin" }
}
```

If you get `"Invalid email or password"`, the bcrypt hash in `users.sql`
was generated for a different password. Repeat Steps 1-D through 1-F
using the correct password.

---

## Troubleshooting — Backend

**Error: connect ECONNREFUSED 127.0.0.1:3306**

MySQL is not running. Start it (see database troubleshooting above).

---

**Error: Cannot find module 'express'**

Run `npm install` inside the `backend` folder.

---

**Error: secretOrPrivateKey must have a value**

Your `JWT_SECRET` is empty in `.env`. Add a value.

---

**Port 4000 already in use**

Change `PORT=4001` in `.env`. Then use port 4001 everywhere.

Or kill the process using port 4000:

Windows:
```
netstat -ano | findstr :4000
taskkill /PID <number shown> /F
```

Mac / Linux:
```
lsof -ti:4000 | xargs kill
```

---

**CORS error in browser console**

The `FRONTEND_URL` in `.env` does not match the URL you opened the
frontend from. For local development, the backend allows all common
localhost origins automatically, including requests from files opened
directly in the browser.

If you still see CORS errors locally, open your `.env` and add the
exact URL you see in your browser's address bar as `FRONTEND_URL`.

---

# PART 3 — FRONTEND SETUP

## Step 3-A — Confirm the backend URL is set

Open `frontend/html/index.html` in a text editor.

Search for `FIGHTEA_API_BASE`. You will find this line near the bottom:
```js
window.FIGHTEA_API_BASE = 'http://localhost:4000/api';
```

For local development, leave it exactly as shown.
For production, you will change this to your live backend URL (covered in Part 4).

---

## Step 3-B — Open the frontend

Double-click `frontend/html/index.html` to open it in your browser.

Or in VS Code, right-click the file → Open with Live Server.

---

## Step 3-C — Log in as admin

1. Click **Sign In** in the navigation bar
2. Enter your email: `admin@fightea.com`
3. Enter the password you chose in Step 1-D
4. Click **Sign In**

You should be redirected to the Admin Dashboard.

**If login fails:**
- Open your browser's developer tools (F12) → Console tab
- Look for any red error messages
- The most common cause is the backend is not running — check that
  the terminal from Step 2-D is still open and showing no errors
- Second most common cause: wrong password — repeat Steps 1-D, 1-E, 1-F

---

## Step 3-D — First-time admin setup

After logging in as admin, complete this setup in order:

**1. Add Categories** (Menu Manager → Categories → + Add Category)

Examples: Milk Tea, Fruit Tea, Specialty, Coffee, Food, Snacks
Add as many as your shop needs.

**2. Add Sizes** (Menu Manager → Sizes → + Add Size)

Examples:
- Small (12oz) — Price add: 0
- Medium (16oz) — Price add: 0
- Large (22oz) — Price add: 20

Sizes only appear for items where you check "Enable Sizes".
Do not enable sizes for food items like rice meals or fries.

**3. Add Toppings** (Menu Manager → Toppings → + Add Topping)

Examples: Tapioca Pearls (₱15), Pudding (₱15), Popping Boba (₱15)

**4. Add Menu Items** (Menu Manager → + Add Item)

For each drink:
- Fill in name, category, base price, description
- Check "Enable Sizes" for drinks
- Upload a photo or paste an image URL
- Check "Mark as Best Seller" for featured drinks

For food items (rice meals, fries, etc.):
- Do NOT check "Enable Sizes"
- Use "Varieties" for options like Regular / Cheesy / Overload

**5. Update GCash Number** (Settings → GCash Number)

Enter your real GCash number.

**6. Add Staff Accounts** (Users → + Add User → Role: Staff)

Staff can view and update the order queue.
Staff cannot manage the menu, promos, or users.

---

## Step 3-E — Test the full ordering flow

1. Click Sign Out to log out of the admin account
2. Click Get Started to create a new customer account
3. Browse the menu and add a drink to your cart
4. Go to cart → Checkout → select Cash → Place Order
5. Log back in as admin → Order Queue
6. You should see the new order as Pending
7. Click Start Prep → Mark Ready
8. If the customer tab is still open, they should see the order-ready popup

---

## Troubleshooting — Frontend

**The login form does nothing when submitted**

Open browser console (F12). Look for network errors.
Most likely the backend is not running — check your terminal.

---

**"Invalid email or password" even though I just set up the account**

The password you typed into the login form does not match the password
you used when generating the bcrypt hash in Step 1-D.

Regenerate the hash with exactly the password you want to use:
```
node -e "require('bcrypt').hash('EXACT_PASSWORD_HERE',12).then(h=>console.log(h))"
```

Update `users.sql`, then:
```
mysql -u root -p fightea_db -e "DELETE FROM users WHERE email='admin@fightea.com';"
mysql -u root -p fightea_db < backend/database/users.sql
```

---

**CORS error: "blocked by CORS policy"**

The backend CORS configuration allows requests from files opened directly
in the browser (no Origin header). If you are still seeing this:

1. Make sure the backend is running on port 4000
2. Check that `window.FIGHTEA_API_BASE` in `index.html` points to `http://localhost:4000/api`
3. Restart the backend after any `.env` changes

---

**Menu shows "Menu coming soon" even after adding items**

After adding items in the Admin Dashboard, click the Menu link in
the navbar. The page fetches live data from the API each time you visit.

---

# PART 4 — DEPLOYMENT

## Overview

```
[Browser]
    │  HTTPS requests
    ▼
[Vercel — Frontend]          (static HTML/CSS/JS)
    │  fetch() API calls
    ▼
[Vercel — Backend API]       (Node.js serverless)
    │  mysql2 connection
    ▼
[PlanetScale or Railway]     (hosted MySQL database)
    │  DNS pointing
    ▼
[Hostinger domain]           (yourdomain.com)
```

---

## Step 4-A — Set up a hosted MySQL database

You cannot use your local MySQL in production. Choose one of these:

### Option 1: PlanetScale (recommended — generous free tier)

1. Go to https://planetscale.com and sign up
2. Click **Create a new database** → name it `fightea_db` → select a region close to you
3. Click **Connect** → choose **General** → copy the connection details
   (Host, Username, Password)
4. Click the **Branches** tab → click `main` → click **Console**
5. Paste the contents of `backend/database/schema.sql` into the console and run it
6. Paste the contents of `backend/database/inventory.sql` and run it
7. Paste the contents of `backend/database/users.sql` (with your real hash) and run it

> **PlanetScale note:** PlanetScale uses `vitess` which does not enforce foreign key
> constraints. The schema will import without errors. The application still works
> correctly because data integrity is maintained by the application code.

### Option 2: Railway (supports foreign keys, very easy setup)

1. Go to https://railway.app and sign up with GitHub
2. Click **New Project** → **Provision MySQL**
3. Click the MySQL service → click **Variables** tab → copy these values:
   `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQLPASSWORD`
4. Click the **Data** tab → use the query console to run your SQL files

### Option 3: Clever Cloud (European, free hobby plan)

1. Go to https://console.clever-cloud.com
2. Create an add-on → MySQL 8 → copy the connection details

---

## Step 4-B — Install the Vercel CLI

Run this once on your computer:
```
npm install -g vercel
```

Verify it works:
```
vercel --version
```

---

## Step 4-C — Log in to Vercel

```
vercel login
```

A browser window opens. Sign up or log in with your GitHub or email account.
Return to the terminal when done.

---

## Step 4-D — Deploy the backend

Navigate to the backend folder:
```
cd C:\Projects\FighTea_v5\backend
```

Deploy:
```
vercel
```

Answer the prompts exactly like this:
- **Set up and deploy?** → press Enter (Yes)
- **Which scope?** → select your account, press Enter
- **Link to existing project?** → type `n`, press Enter
- **What's your project's name?** → type `fightea-api`, press Enter
- **In which directory is your code located?** → press Enter (current folder)
- **Want to modify these settings?** → type `n`, press Enter

Vercel will deploy and give you a URL like:
```
https://fightea-api.vercel.app
```

Write this URL down — you need it in later steps.

---

## Step 4-E — Set environment variables on Vercel (backend)

Go to https://vercel.com → Dashboard → click `fightea-api` → click
**Settings** → click **Environment Variables**.

Add each variable one at a time. Click **Add** after each one:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `DB_HOST` | your hosted database host |
| `DB_PORT` | `3306` (or the port your DB provider shows) |
| `DB_USER` | your hosted database username |
| `DB_PASS` | your hosted database password |
| `DB_NAME` | `fightea_db` |
| `JWT_SECRET` | the same 96-char hex string from your local `.env` |
| `FRONTEND_URL` | `https://fightea.vercel.app` (update this after Step 4-G) |

After adding all variables, deploy to production:
```
vercel --prod
```

Test the live API:
```
curl https://fightea-api.vercel.app/api/health
```

Expected: `{"status":"ok","timestamp":"..."}`

---

## Step 4-F — Update the frontend API URL

Open `frontend/html/index.html` in your text editor.

Find this line near the bottom of the file:
=======
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

>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
```js
window.FIGHTEA_API_BASE = 'http://localhost:4000/api';
```

Change it to your live backend URL:
<<<<<<< HEAD
=======

>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
```js
window.FIGHTEA_API_BASE = 'https://fightea-api.vercel.app/api';
```

Save the file.

---

<<<<<<< HEAD
## Step 4-G — Deploy the frontend

Navigate to the frontend folder:
```
cd C:\Projects\FighTea_v5\frontend
```

Deploy:
```
=======
### Step B — Deploy the frontend

```cmd
cd C:\Projects\FighTea_v5\frontend
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
vercel
```

Answer the prompts:
<<<<<<< HEAD
- **Project name?** → type `fightea`, press Enter
- **Directory?** → press Enter (current folder)
- **Modify settings?** → type `n`, press Enter

Vercel gives you a URL like:
```
https://fightea.vercel.app
```

---

## Step 4-H — Update CORS on the backend

Now that you have the frontend URL, update the backend environment variable.

Go to Vercel Dashboard → `fightea-api` → Settings → Environment Variables.

Update `FRONTEND_URL` to: `https://fightea.vercel.app`

Then redeploy the backend:
```
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
cd C:\Projects\FighTea_v5\backend
vercel --prod
```

---

<<<<<<< HEAD
## Step 4-I — Test the live deployment

1. Open `https://fightea.vercel.app` in your browser
2. Click Sign In → enter `admin@fightea.com` and your password
3. You should land on the Admin Dashboard
4. Go to Menu Manager → add a Category → add a Drink
5. Click Back to Shop → click Menu
6. Your drink should appear in the menu

---

# PART 5 — CONNECT HOSTINGER DOMAIN

## Step 5-A — Add your domain to Vercel (frontend)

1. Go to https://vercel.com → Dashboard → click the `fightea` project
2. Click **Settings** → click **Domains**
3. In the input field, type `yourdomain.com` → click **Add**
4. Also add `www.yourdomain.com` → click **Add**

Vercel shows you DNS records you need to add. Keep this tab open.

---

## Step 5-B — Update DNS on Hostinger

1. Log in to https://hpanel.hostinger.com
2. Click **Domains** → click your domain name
3. Click **DNS / Nameservers** → click **Manage DNS Records**

Delete any existing `A` record for `@` (the root domain) if one exists.

Add these two records exactly as shown:

| Type | Name | Points To | TTL |
|------|------|-----------|-----|
| `A` | `@` | `76.76.21.21` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com.` | 3600 |

Click **Save Changes**.

---

## Step 5-C — Wait for DNS propagation

DNS changes take between 15 minutes and 48 hours to work worldwide.

Check the current status at: https://dnschecker.org
Enter your domain name and check the `A` record.
When it shows `76.76.21.21` from most locations, it has propagated.

---

## Step 5-D — SSL certificate

Vercel automatically issues a free SSL certificate once it detects your
DNS is correctly configured. No action required. The padlock icon in the
browser appears automatically within a few minutes of DNS propagation.

---

## Step 5-E — Update CORS and API URL for your custom domain

**Update the backend FRONTEND_URL:**

Go to Vercel → `fightea-api` → Settings → Environment Variables.
Update `FRONTEND_URL` to `https://www.yourdomain.com`

Redeploy:
```
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
cd C:\Projects\FighTea_v5\backend
vercel --prod
```

<<<<<<< HEAD
**Update the frontend API_BASE (optional — only if you also use a custom API domain):**

If you want `api.yourdomain.com` to point to your backend:

Add a CNAME record on Hostinger:
| Type | Name | Points To | TTL |
|------|------|-----------|-----|
| `CNAME` | `api` | `cname.vercel-dns.com.` | 3600 |

Add the domain in Vercel → `fightea-api` → Settings → Domains → add `api.yourdomain.com`.

Then update `frontend/html/index.html`:
=======
---

### Step E — Update API_BASE in frontend (if using custom API domain)

If you also added a domain like `api.yourdomain.com` to your backend:

Add a `CNAME` record on Hostinger:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `api` | `cname.vercel-dns.com.` | 3600 |

Then in `frontend/html/index.html` update:
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
```js
window.FIGHTEA_API_BASE = 'https://api.yourdomain.com/api';
```

Redeploy the frontend:
<<<<<<< HEAD
```
=======
```cmd
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
cd C:\Projects\FighTea_v5\frontend
vercel --prod
```

---

<<<<<<< HEAD
## Troubleshooting — Deployment

**Vercel build fails: "Cannot find module 'express'"**

`package.json` or `package-lock.json` is not committed to Git.
Make sure both files exist in the `backend` folder.
Do not add `node_modules/` to Git.

---

**API returns 500 on Vercel but works locally**

An environment variable is missing or wrong on Vercel.

Check: Vercel Dashboard → your project → Settings → Environment Variables.
Make sure every variable from your `.env` is added there.
After adding or changing variables, run `vercel --prod` to redeploy.

---

**"ERR_CONNECTION_REFUSED" from Vercel to database**

Your hosted database may block connections from Vercel's IP addresses.

For PlanetScale: all connections are allowed by default. No action needed.

For Railway: go to your MySQL service settings. Connections from external
IPs should be enabled by default.

For Clever Cloud or Hostinger MySQL: look for "Allowed IP addresses" or
"Remote MySQL" in the database settings. Add `0.0.0.0/0` to allow all IPs.
(Vercel uses dynamic IPs so you cannot whitelist specific ones.)

---

**CORS error in production**

The `FRONTEND_URL` environment variable on Vercel does not match
the origin your frontend is served from.

Rules:
- No trailing slash: `https://fightea.vercel.app` ✓  not  `https://fightea.vercel.app/` ✗
- Include `https://`
- Must be the exact URL users see in their browser

After changing, redeploy the backend: `vercel --prod`

---

**Domain not working after adding DNS records**

DNS propagation takes up to 48 hours. Check progress at https://dnschecker.org.
If the `A` record shows your old IP, wait and check again later.
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728

---

**Vercel function timeout (504 error)**

<<<<<<< HEAD
The Vercel free plan limits serverless functions to 10 seconds.
If a database query takes too long, it will timeout.

Options:
1. The `schema.sql` already adds indexes to commonly queried columns
2. For busier shops, upgrade to Vercel Pro (60-second limit)
3. Move the backend to Railway which runs as a persistent server (no timeout)

---

# PART 6 — UPDATING YOUR SYSTEM

## When you make code changes

**To update the backend on Vercel:**
```
cd C:\Projects\FighTea_v5\backend
vercel --prod
```

**To update the frontend on Vercel:**
```
cd C:\Projects\FighTea_v5\frontend
vercel --prod
```

---

## When you add a new admin or staff account

Use the Admin Dashboard → Users → + Add User.
Set the role to Staff or Admin as needed.

You do not need to touch the database directly.

---

## Security checklist before going live

- [ ] The admin password has been changed from the default
- [ ] `users.sql` has a real bcrypt hash, not the placeholder
- [ ] `JWT_SECRET` is at least 64 characters long and kept secret
- [ ] `NODE_ENV` is set to `production` in Vercel environment variables
- [ ] `FRONTEND_URL` is set to your exact live domain in Vercel
- [ ] The `.env` file is in `.gitignore` and has never been pushed to Git
- [ ] HTTPS is enabled on your domain (automatic with Vercel)

---

# PART 7 — API REFERENCE

All API requests use JSON. Protected endpoints require an `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
=======
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
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
```

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
<<<<<<< HEAD
| GET | /api/health | None | Server health check |
| POST | /api/auth/login | None | Login, returns JWT token |
| POST | /api/auth/register | None | Register a new customer |
| GET | /api/auth/me | Any | Get the current logged-in user |
| GET | /api/menu/categories | None | List all categories |
| POST | /api/menu/categories | Admin | Create a category |
| PUT | /api/menu/categories/:id | Admin | Rename a category |
| DELETE | /api/menu/categories/:id | Admin | Remove a category |
| GET | /api/menu/products | None | Get all menu items with varieties |
| POST | /api/menu/products | Admin | Add a new product |
| PUT | /api/menu/products/:id | Admin | Update a product |
| DELETE | /api/menu/products/:id | Admin | Remove a product |
| GET | /api/menu/sizes | None | Get all size options |
| POST | /api/menu/sizes | Admin | Add a size |
| PUT | /api/menu/sizes/:id | Admin | Edit a size |
| DELETE | /api/menu/sizes/:id | Admin | Remove a size |
| GET | /api/menu/toppings | None | Get all toppings |
| POST | /api/menu/toppings | Admin | Add a topping |
| PUT | /api/menu/toppings/:id | Admin | Edit a topping |
| DELETE | /api/menu/toppings/:id | Admin | Remove a topping |
| GET | /api/menu/promos | None | Get all promos |
| POST | /api/menu/promos | Admin | Create a promo |
| PUT | /api/menu/promos/:id | Admin | Update a promo |
| DELETE | /api/menu/promos/:id | Admin | Remove a promo |
| POST | /api/orders | Customer | Place an order |
| GET | /api/orders?status= | Staff/Admin | Get orders (filter by status) |
| PATCH | /api/orders/:id/status | Staff/Admin | Update order status |
| PUT | /api/orders/:id | Staff/Admin | Edit order details |
| GET | /api/users | Admin | List all users |
| POST | /api/users | Admin | Create a staff or admin user |
| PUT | /api/users/:id | Admin | Update a user |
| DELETE | /api/users/:id | Admin | Remove a user |
| GET | /api/analytics/summary | Admin | Revenue, top sellers, stats |
| GET | /api/notifications/stream | Any | SSE stream for live updates |
| GET | /api/notifications/poll | Any | Polling fallback for live updates |
=======
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

>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
