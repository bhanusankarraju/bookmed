from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str


class DoctorResponse(BaseModel):
    id: str
    email: str
    name: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    doctor: DoctorResponse


class AppointmentCreate(BaseModel):
    patient_name: str
    patient_phone: str
    department: str
    appointment_date: str
    appointment_time: str
    status: str = "Confirmed"


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    department: Optional[str] = None
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: str
    patient_name: str
    patient_phone: str
    department: str
    appointment_date: str
    appointment_time: str
    status: str
    created_at: str
