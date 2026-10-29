# CHASTE PHP Login API

This PHP API uses MySQL and PDO. It provides `POST /register.php` and `POST /login.php`; passwords are stored as hashes, and successful requests start a PHP session.

## Requirements

- PHP 8.0 or newer with `pdo_mysql` enabled
- MySQL or MariaDB

## Database setup

Run `schema.sql` with a MySQL account that can create the database and table:

```powershell
mysql -u root -p < schema.sql
```

Set the connection values in the PowerShell window where PHP will run. Replace the example password with your local MySQL password:

```powershell
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"
$env:DB_NAME = "chaste_app_db"
$env:DB_USER = "Chaste_user"
$env:DB_PASSWORD = "password123"
$env:FRONTEND_ORIGIN = "http://localhost:5173"
```

Do not commit real database credentials. The defaults are for a local MySQL installation with an empty root password; set `DB_PASSWORD` if yours differs.

## Run

From the project root, start the PHP API on port 8001 (the existing FastAPI service may use port 8000):

```powershell
php -S localhost:8001 -t backend/php
```

The React app calls `http://localhost:8001` by default. Set `VITE_PHP_API_URL` in the frontend environment to change that URL. Keep both services running while developing.