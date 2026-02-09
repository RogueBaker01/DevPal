import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.db_models import Usuario
from app.routers.auth import verify_password

TEST_EMAIL = os.getenv("TEST_USER_EMAIL", "test@devpal.com")
TEST_PASSWORD = os.getenv("TEST_USER_PASSWORD", "changeme_test")

db = SessionLocal()

user = db.query(Usuario).filter(Usuario.email == TEST_EMAIL).first()

if user:
    print(f"Usuario encontrado: {user.email}")
    print(f"   ID: {user.id}")
    print(f"   Password hash: {user.password_hash[:20]}...")
    
    try:
        result = verify_password(TEST_PASSWORD, user.password_hash)
        print(f"   Verificacion de password: {result}")
    except Exception as e:
        print(f"Error en verify_password: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"No hay usuario con email {TEST_EMAIL}")
    print("\nUsuarios en la DB:")
    users = db.query(Usuario).limit(5).all()
    for u in users:
        print(f"  - {u.email} (ID: {u.id})")

db.close()
