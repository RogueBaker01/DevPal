"""
Test directo del endpoint de login sin pasar por SlowAPI
"""
import sys
sys.path.insert(0, 'c:/Users/Rogue/Documents/DevPal/Back')

from app.database import SessionLocal
from app.models.db_models import Usuario
from app.routers.auth import LoginRequest, verify_password
from fastapi import HTTPException

# Crear request de prueba
login_request = LoginRequest(
    email="test@devpal.com",
    password="test123"
)

db = SessionLocal()

try:
    # Simular lo que hace el endpoint
    print(f"Buscando usuario: {login_request.email}")
    user = db.query(Usuario).filter(Usuario.email == login_request.email).first()
    
    if not user:
        print("❌ Usuario no encontrado")
    else:
        print(f"✅ Usuario encontrado: {user.id}")
        print(f"   Email: {user.email}")
        print(f"   Password hash: {user.password_hash[:30]}...")
        
        # Verificar password
        print(f"\nVerificando password...")
        try:
            is_valid = verify_password(login_request.password, user.password_hash)
            print(f"   Resultado: {is_valid}")
            
            if is_valid:
                print("\n✅ LOGIN EXITOSO!")
                print(f"   User ID: {user.id}")
                print(f"   Email: {user.email}")
            else:
                print("\n❌ Password incorrecta")
        except Exception as e:
            print(f"\n❌ Error al verificar password: {e}")
            import traceback
            traceback.print_exc()
            
except Exception as e:
    print(f"❌ Error general: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
