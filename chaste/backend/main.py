import os

import bcrypt
import pymysql
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymysql.cursors import DictCursor


def get_allowed_origins() -> list[str]:
    origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    return [origin.strip() for origin in origins.split(",") if origin.strip()]


app = FastAPI(title="CHASTE API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.get("/")
def root():
    return {"Message": "CHASTE API IS CURRENTLT RUNNING"}


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/api/auth/login", tags=["auth"])
def login(credentials: LoginRequest) -> dict:
    email = credentials.email.strip().lower()
    if "@" not in email or not credentials.password:
        raise HTTPException(status_code=422, detail="Enter a valid email and password.")

    try:
        connection = pymysql.connect(
            host="127.0.0.1",
            port=3307,
            user="root",
            password="",
            database=os.getenv("DB_NAME", "chaste_app_db"),
            charset="utf8mb4",
            cursorclass=DictCursor,
            connect_timeout=5,
        )
    except Exception as e:
        print(repr(e), flush=True)
        raise HTTPException(status_code=503, detail="Could not connect to the account database.") from e

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, password_hash, security_question "
                "FROM chaste_app_login_db WHERE email = %s",
                (email,),
            )
            user = cursor.fetchone()
    finally:
        connection.close()

    try:
        password_matches = user is not None and bcrypt.checkpw(
            credentials.password.encode("utf-8"), user["password_hash"].encode("utf-8")
        )
    except (ValueError, TypeError):
        password_matches = False

    if not password_matches:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": int(user["id"]),
            "name": user["name"],
            "email": user["email"],
            "security_question": user["security_question"],
        },
    }