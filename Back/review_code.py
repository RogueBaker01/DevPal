import time
from google import genai

def review_code(codigo, lenguaje, client, informacion_usuario):
    prompt = f"""
    Actúa como una API de Revisión de Código Estático y Calidad de Software.

    INPUTS:
    - Lenguaje: {lenguaje}
    - Snippet a revisar: {codigo}
    - Perfil del Candidato: Nombre: {informacion_usuario["nombre"]}
    
    TASK:
    Realiza un análisis de calidad de código (Code Review) estilo FAANG. Sé crítico pero constructivo.

    OUTPUT FORMAT:
    Devuelve SOLAMENTE un objeto JSON válido. No uses markdown.

    SCHEMA:
    {{
    "resumen_ejecutivo": "string (1 frase sobre la calidad general del código)",
    "puntos_fuertes": ["string", "string"],
    "oportunidades_mejora": [
        {{
        "categoria": "string (Ej: Rendimiento, Legibilidad, Seguridad)",
        "descripcion": "string (Qué está mal)",
        "severidad": "string (Alta/Media/Baja)"
        }}
    ],
    "optimizacion_sugerida": {{
        "explicacion": "string (Qué cambiar)",
        "codigo_mejorado": "string (Snippet corto con la mejora aplicada, si aplica)"
    }},
    "pista_conceptual": "string (Concepto teórico que el usuario debería estudiar)"
    }}
    """
    response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=prompt
    )
    return response.text, time.time()
