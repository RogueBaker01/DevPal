from google import genai
from google.genai import types

def generar_micro_desafio(nivel: str, tema: str, lenguaje: str):
    client = genai.Client(api_key="AIzaSyBDsoTIRGJOisnNSDPasaBTapiAOoogoLk")
    prompt = f"""Actúa como: Un Ingeniero de Software Senior y Entrevistador Técnico (FAANG level).
    Tu tarea: Generar un "Micro-desafío" de programación en {lenguaje} de nivel "{nivel}".
    Tema: "{tema}".
    Estructura de le respuesta:   
    1. Escenario Real: Describe brevemente un problema de negocio o ingeniería (ej: "Estamos procesando telemetría de un sensor y necesitamos filtrar ruido...").
    2. El Problema: Definición técnica precisa de lo que se debe programar.
    3. Firma de la Función: def nombre_funcion(input: tipo) -> tipo: 
    4. Input / Output:
    Input: Descripción y formato.
    Output: Lo que debe retornar.
    5. Restricciones (Challenge):
    Complejidad temporal máxima (ej: $O(n)$ o $O(\log n)$).
    Restricciones de memoria o uso de librerías (ej: "No usar librerías externas, solo nativas").
    6. Casos de Prueba (Ejemplos):
    Caso Normal.
    Caso Borde (Edge Case: lista vacía, números negativos, etc.).
    7. Pista Conceptual: Una breve guía sobre qué estructura de datos o patrón de diseño podría ser útil, sin dar la solución..
    8. No menciones que eres un ingeniero de software ni que eres un entrevistador técnico, solo muestra el micro-desafío."""
    response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=prompt
    )
    print(response.text)

generar_micro_desafio("Básico", "Algoritmos", "Python")  
