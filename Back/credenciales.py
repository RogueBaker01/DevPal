import os
from dotenv import load_dotenv

load_dotenv()

def api_key():
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY no encontrada en variables de entorno. Verifica tu archivo .env")
    return key