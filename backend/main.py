from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import bcrypt

from routes import router
from database import fetch_doctor_by_email, create_doctor
from config import DOCTOR_EMAIL, DOCTOR_PASSWORD, DOCTOR_NAME

app = FastAPI(title="BookMed API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {"status": "ok", "message": "BookMed API is running"}


@app.on_event("startup")
async def seed_doctor():
    existing = await fetch_doctor_by_email(DOCTOR_EMAIL)
    if not existing:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(DOCTOR_PASSWORD.encode("utf-8"), salt).decode("utf-8")
        await create_doctor({
            "email": DOCTOR_EMAIL,
            "password_hash": hashed,
            "name": DOCTOR_NAME,
        })
        print(f"Seeded default doctor: {DOCTOR_EMAIL} / {DOCTOR_PASSWORD}")
