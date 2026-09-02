import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("NEXT_PUBLIC_SUPABASE_URL", ""))
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""))
JWT_SECRET = os.getenv("JWT_SECRET", "bookmed-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24

DOCTOR_EMAIL = "doctor@bookmed.com"
DOCTOR_PASSWORD = "doctor123"
DOCTOR_NAME = "Dr. Smith"
