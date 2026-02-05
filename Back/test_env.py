"""
Script de prueba para verificar que la configuración .env funciona correctamente
"""
from credenciales import api_key

try:
    key = api_key()
    print("✅ API Key cargada correctamente desde .env")
    print(f"📌 Primeros 10 caracteres: {key[:10]}...")
    print(f"📌 Últimos 4 caracteres: ...{key[-4:]}")
    print("\n✅ La configuración de seguridad está lista!")
except Exception as e:
    print(f"❌ Error al cargar la API key: {e}")
