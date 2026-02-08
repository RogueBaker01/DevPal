from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from typing import Tuple, Any
from starlette.concurrency import run_in_threadpool
import logging

from app.services.noticias_generator import buscar_noticias_generales
from app.services.eventos_generator import buscar_eventos_generales
from app.services.desafios_generator import generar_desafio_diario
from app.services.code_review_generator import generar_pista
from app.services.review_code_generator import review_code
from app.credenciales import api_key
from app.config import get_settings
from app.database import get_db

settings = get_settings()
# client initialization moved to __init__ for safety
logger = logging.getLogger(__name__)

class IAService:
    
    def __init__(self, db: Session):
        self.db = db
        try:
            self.client = genai.Client(api_key=api_key())
        except Exception as e:
            logger.error(f"Error initializing GenAI client: {e}")
            self.client = None
    
    def generar_y_guardar_noticias(
        self, 
        usuario_id: str | None = None, 
        limite: int = 50
    ) -> Tuple[int, int]:
        
        from app.models.db_models import Noticia
        
        if not self.client:
            logger.warning("GenAI client not initialized. Skipping news generation.")
            return 0, 0

        try:
            noticias_raw, timestamp = buscar_noticias_generales(self.client, limite)
            
            if not noticias_raw:
                return 0, 0
            
            urls_generadas = [n['url'] for n in noticias_raw]
            urls_existentes = self.db.query(Noticia.url).filter(
                Noticia.url.in_(urls_generadas)
            ).all()
            urls_existentes_set = {url[0] for url in urls_existentes}
            
            noticias_nuevas = [n for n in noticias_raw if n['url'] not in urls_existentes_set]
            
            for noticia_data in noticias_nuevas:
                noticia = Noticia(
                    usuario_id=usuario_id,
                    titulo_resumen=noticia_data['titulo_resumen'],
                    url=noticia_data['url'],
                    fecha_publicacion=noticia_data.get('fecha_publicacion'),
                    imagen_url=noticia_data.get('imagen_url', ''),
                    fuente=noticia_data.get('fuente', ''),
                    relevancia=noticia_data.get('relevancia', 'Media')
                )
                self.db.add(noticia)
            
            self.db.commit()
            
            duplicadas = len(noticias_raw) - len(noticias_nuevas)
            return len(noticias_nuevas), duplicadas

        except Exception as e:
            logger.error(f"Error generando noticias (posible quota limit): {e}")
            self.db.rollback()
            return 0, 0
    
    def generar_y_guardar_eventos(
        self, 
        limite: int = 15
    ) -> Tuple[int, int]:
       
        from app.models.db_models import Evento
        from sqlalchemy import and_, or_
        
        if not self.client:
            logger.warning("GenAI client not initialized. Skipping event generation.")
            return 0, 0

        try:
            eventos_raw, timestamp = buscar_eventos_generales(self.client, limite)
            
            if not eventos_raw:
                return 0, 0
            
            eventos_existentes = self.db.query(Evento).filter(
                or_(*[
                    and_(
                        Evento.titulo == e['titulo'],
                        Evento.fecha == e['fecha'],
                        Evento.ubicacion == e.get('ubicacion', '')
                    )
                    for e in eventos_raw
                ])
            ).all()
            
            eventos_existentes_keys = {
                (e.titulo, str(e.fecha), e.ubicacion) for e in eventos_existentes
            }
            
            eventos_nuevos = [
                e for e in eventos_raw
                if (e['titulo'], e['fecha'], e.get('ubicacion', '')) not in eventos_existentes_keys
            ]
            
            for evento_data in eventos_nuevos:
                evento = Evento(
                    titulo=evento_data['titulo'],
                    descripcion=evento_data.get('descripcion', ''),
                    fecha=evento_data['fecha'],
                    hora=evento_data['hora'],
                    ubicacion=evento_data.get('ubicacion', ''),
                    categoria=evento_data['categoria'],
                    imagen_url=evento_data.get('imagen_url', ''),
                    cupos_disponibles=evento_data.get('cupos_disponibles', 100),
                    es_popular=evento_data.get('es_popular', False),
                    organizador=evento_data.get('organizador', ''),
                    url_externa=evento_data.get('url_externa', ''),
                    latitud=evento_data.get('latitud'),
                    longitud=evento_data.get('longitud')
                )
                self.db.add(evento)
            
            self.db.commit()
            
            duplicados = len(eventos_raw) - len(eventos_nuevos)
            return len(eventos_nuevos), duplicados

        except Exception as e:
            logger.error(f"Error generando eventos (posible quota limit): {e}")
            self.db.rollback()
            return 0, 0
    
    def generar_y_guardar_desafio(
        self,
        usuario_id: str,
        user_info: dict,
    ) -> dict | None:
        """
        Genera un desafío diario personalizado y lo guarda en la base de datos.
        """
        from app.models.db_models import DesafioDiario
        
        if not self.client:
            logger.warning("GenAI client not initialized. Skipping challenge generation.")
            return None

        try:
            # 1. Obtener historial de desafíos para evitar repetición
            desafios_previos = self.db.query(DesafioDiario.titulo).filter(
                DesafioDiario.usuario_id == usuario_id
            ).limit(20).all()
            historia_titulos = [d[0] for d in desafios_previos]
            
            # 2. Generar desafío con IA
            desafio_raw, timestamp = generar_desafio_diario(
                self.client, 
                user_info, 
                historia_titulos
            )
            
            if not desafio_raw:
                return None
            
            # 3. Guardar en base de datos
            desafio = DesafioDiario(
                usuario_id=usuario_id,
                titulo=desafio_raw['titulo'],
                lenguaje_recomendado=desafio_raw.get('lenguaje_recomendado', 'python'),
                contexto_negocio=desafio_raw.get('contexto_negocio', ''),
                definicion_problema=desafio_raw['definicion_problema'],
                templates_lenguajes_json=desafio_raw.get('templates_por_lenguaje', {}),
                restricciones_json=desafio_raw.get('restricciones', {}),
                casos_prueba_json=desafio_raw.get('casos_prueba', []),
                pista=desafio_raw.get('pista', ''),
                dificultad=desafio_raw.get('dificultad', 'Medio'),
                xp_recompensa=desafio_raw.get('xp_recompensa', 50),
                estado='pendiente'
            )
            self.db.add(desafio)
            self.db.commit()
            self.db.refresh(desafio)
            
            return desafio

        except Exception as e:
            logger.error(f"Error generando desafío (posible quota limit): {e}")
            self.db.rollback()
            return None
    
    async def realizar_code_review(
        self,
        usuario_id: str,
        codigo: str,
        lenguaje: str,
        informacion_usuario: dict
    ) -> dict | None:
        """
        Realiza revisión de código con IA y guarda el resultado.
        """
        from app.models.db_models import RevisionCodigo
        
        if not self.client:
            return {
                "resumen_ejecutivo": "Servicio de IA no disponible (Error de Configuración/Inicialización).",
                "puntos_fuertes_json": [],
                "oportunidades_mejora_json": [],
                "pista_conceptual": "Por favor contacta al administrador."
            }

        try:
            # 1. Generar review con IA (Ejecutado en threadpool para no bloquear)
            review_raw, timestamp = await run_in_threadpool(
                review_code,
                codigo, 
                lenguaje, 
                self.client, 
                informacion_usuario
            )
            
            if not review_raw:
                return None
            
            # 2. Guardar en base de datos
            revision = RevisionCodigo(
                usuario_id=usuario_id,
                lenguaje=lenguaje,
                codigo_original=codigo,
                resumen_ejecutivo=review_raw.get('resumen_ejecutivo', ''),
                puntos_fuertes_json=review_raw.get('puntos_fuertes', []),
                oportunidades_mejora_json=review_raw.get('oportunidades_mejora', []),
                optimizacion_json=review_raw.get('optimizacion_sugerida', {}),
                pista_conceptual=review_raw.get('pista_conceptual', '')
            )
            self.db.add(revision)
            self.db.commit()
            self.db.refresh(revision)
            
            return revision

        except Exception as e:
            logger.error(f"Error en Code Review (posible quota limit): {e}")
            self.db.rollback()
            # Retornar un review de fallback si falla la IA
            return {
                "resumen_ejecutivo": "El servicio de IA está temporalmente no disponible (Quota Limit). Intenta más tarde.",
                "puntos_fuertes_json": [],
                "oportunidades_mejora_json": [],
                "pista_conceptual": "Verifica tu sintaxis y lógica básica manualmente por ahora."
            }
    
    async def generar_pista_codigo(
        self,
        codigo: str,
        lenguaje: str,
        informacion_usuario: dict
    ) -> dict | None:
        """
        Genera una pista para código del usuario.
        No se guarda en BD (es efímera).
        """
        if not self.client:
             return {"pista": "Servicio de IA no inicializado."}

        try:
            # Ejecutado en threadpool para no bloquear
            pista_raw, timestamp = await run_in_threadpool(
                generar_pista,
                codigo, 
                lenguaje, 
                self.client, 
                informacion_usuario
            )
            
            return pista_raw
        except Exception as e:
            logger.error(f"Error generando pista (posible quota limit): {e}")
            return {"pista": "No se pudo generar una pista en este momento (IA ocupada)."}


from fastapi import Depends

def get_ia_service(db: Session = Depends(get_db)) -> IAService:
    return IAService(db)
