import time
from google import genai


def generar_pista(codigo, lenguaje, client, informacion_usuario):
    prompt = f"""
    Actúa como una API de Mentoría de Código (Backend).

    INPUTS:
    - Lenguaje: {lenguaje}
    - Código del usuario (Snippet/Intento): {codigo}
    - Perfil del Candidato: Nombre: {informacion_usuario["nombre"]}

    TASK:
    Analiza el código proporcionado e identifica el bloqueo lógico o la optimización necesaria. Genera una pista conceptual sin revelar la solución directa.

    OUTPUT FORMAT:
    Devuelve SOLAMENTE un objeto JSON válido.

    SCHEMA:
    {{
    "analisis_interno": "string (Breve diagnóstico del error o ineficiencia detectada - NO MOSTRAR AL USUARIO)",
    "titulo_pista": "string (Ej: 'Uso de Memoria', 'Complejidad', 'Estructura de Datos')",
    "contenido_pista": "string (La guía conceptual. Ej: 'Intenta usar un Hash Map para reducir la búsqueda de O(n) a O(1).')",
    "recurso_recomendado": "string (Nombre de concepto/patrón para que el usuario investigue, ej: 'Two Pointers Technique')"
    }}
    """
    response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=prompt
    )
    return response.text, time.time()