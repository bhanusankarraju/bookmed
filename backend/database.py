import httpx
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
}


async def fetch_all_appointments():
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SUPABASE_URL}/rest/v1/appointments?order=created_at.desc",
            headers=HEADERS,
        )
        resp.raise_for_status()
        return resp.json()


async def fetch_appointments_by_phone(phone):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SUPABASE_URL}/rest/v1/appointments?patient_phone=eq.{phone}&order=created_at.desc",
            headers=HEADERS,
        )
        resp.raise_for_status()
        return resp.json()


async def fetch_appointment_by_id(apt_id):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SUPABASE_URL}/rest/v1/appointments?id=eq.{apt_id}",
            headers=HEADERS,
        )
        resp.raise_for_status()
        data = resp.json()
        return data[0] if data else None


async def create_appointment(data):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{SUPABASE_URL}/rest/v1/appointments",
            headers={**HEADERS, "Prefer": "return=representation"},
            json=data,
        )
        resp.raise_for_status()
        return resp.json()[0]


async def update_appointment(apt_id, data):
    async with httpx.AsyncClient() as client:
        resp = await client.patch(
            f"{SUPABASE_URL}/rest/v1/appointments?id=eq.{apt_id}",
            headers={**HEADERS, "Prefer": "return=representation"},
            json=data,
        )
        resp.raise_for_status()
        result = resp.json()
        return result[0] if result else None


async def fetch_doctor_by_email(email):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SUPABASE_URL}/rest/v1/doctors?email=eq.{email}",
            headers=HEADERS,
        )
        resp.raise_for_status()
        data = resp.json()
        return data[0] if data else None


async def create_doctor(data):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{SUPABASE_URL}/rest/v1/doctors",
            headers={**HEADERS, "Prefer": "return=representation"},
            json=data,
        )
        resp.raise_for_status()
        return resp.json()[0]
