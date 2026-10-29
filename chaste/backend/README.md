# CHASTE Backend

FastAPI service for the CHASTE storefront.

## Setup

From this directory, create and activate a virtual environment, then install dependencies:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set `CORS_ORIGINS` to the frontend origin or comma-separated origins. Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` for the MySQL database used by the PHP endpoints. The login API reads accounts from `chaste_app_login_db` and verifies the existing bcrypt password hashes.

## Run

```powershell
uvicorn main:app --reload --env-file .env
```

The API runs at `http://localhost:8000`. Check `GET /api/health` for service status and visit `/docs` for the interactive API reference.