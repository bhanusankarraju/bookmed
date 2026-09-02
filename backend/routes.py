from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
import bcrypt

from schemas import (
    DoctorLogin,
    DoctorResponse,
    TokenResponse,
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
)
from database import (
    fetch_all_appointments,
    fetch_appointments_by_phone,
    fetch_appointment_by_id,
    create_appointment,
    update_appointment,
    fetch_doctor_by_email,
    create_doctor,
)
from auth import verify_password, create_jwt_token, decode_jwt_token
from config import DOCTOR_EMAIL, DOCTOR_PASSWORD, DOCTOR_NAME

router = APIRouter()


def get_current_doctor(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    try:
        payload = decode_jwt_token(token)
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.post("/auth/login", response_model=TokenResponse)
async def doctor_login(credentials: DoctorLogin):
    doctor = await fetch_doctor_by_email(credentials.email)
    if not doctor:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(credentials.password, doctor["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_jwt_token(doctor["id"], doctor["email"], doctor["name"])
    return TokenResponse(
        access_token=token,
        doctor=DoctorResponse(id=doctor["id"], email=doctor["email"], name=doctor["name"]),
    )


@router.get("/auth/me", response_model=DoctorResponse)
async def get_me(current: dict = Depends(get_current_doctor)):
    return DoctorResponse(id=current["sub"], email=current["email"], name=current["name"])


@router.get("/appointments", response_model=list[AppointmentResponse])
async def list_appointments(current: dict = Depends(get_current_doctor)):
    rows = await fetch_all_appointments()
    return [_format_apt(r) for r in rows]


@router.get("/appointments/phone/{phone}", response_model=list[AppointmentResponse])
async def list_appointments_by_phone(phone: str):
    full_phone = f"+91{phone}"
    rows = await fetch_appointments_by_phone(full_phone)
    return [_format_apt(r) for r in rows]


@router.post("/appointments", response_model=AppointmentResponse)
async def book_appointment(data: AppointmentCreate):
    row = await create_appointment(data.model_dump())
    return _format_apt(row)


@router.patch("/appointments/{apt_id}", response_model=AppointmentResponse)
async def modify_appointment(apt_id: str, data: AppointmentUpdate, current: dict = Depends(get_current_doctor)):
    existing = await fetch_appointment_by_id(apt_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Appointment not found")
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    row = await update_appointment(apt_id, update_data)
    if not row:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return _format_apt(row)


def _format_apt(row: dict) -> AppointmentResponse:
    created = row.get("created_at", "")
    if created and "T" in created:
        created = created.replace("Z", "")
    return AppointmentResponse(
        id=str(row["id"]),
        patient_name=row["patient_name"],
        patient_phone=row["patient_phone"],
        department=row["department"],
        appointment_date=str(row["appointment_date"]),
        appointment_time=row["appointment_time"],
        status=row["status"],
        created_at=created,
    )
