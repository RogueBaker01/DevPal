import time
from google import genai

def generar_noticias(client, urls, informacion_usuario):
    prompt = f"""
    Actúa como un motor de recomendación de noticias API.

    INPUTS:
    - User Profile: {informacion_usuario}
    - News Data: {urls}

    TASK:
    Filtra las noticias basándote en la relevancia semántica con el perfil del usuario. Cubre todos los temas de interés (tecnológicos y no tecnológicos).

    OUTPUT FORMAT:
    Devuelve ÚNICAMENTE un array de objetos JSON válido. No uses Markdown (` ```json `).

    Estructura del objeto:
    [
    {{
        "titulo_resumen": "string",
        "url": "string",
        "fecha": "string",
        "imagen_url": "string",
        "fuente": "string",
        "relevancia": "string (Alta/Media)"
    }}
    ]
    """    
    response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=prompt
    )
    return response.text, time.time()