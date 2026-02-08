from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated
from pydantic import BaseModel
import json
from app.database import get_db
from app.services.ia_service import IAService, get_ia_service
from app.services.code_executor import ejecutar_codigo

router = APIRouter()


@router.get("/hoy")
async def obtener_desafio_del_dia(
    usuario_id: str,
    db: Annotated[Session, Depends(get_db)],
    ia_service: Annotated[IAService, Depends(get_ia_service)]
):
    from app.models.db_models import DesafioDiario, Usuario
    from datetime import datetime
    
    hoy = datetime.now().date()
    desafio = db.query(DesafioDiario).filter(
        DesafioDiario.usuario_id == usuario_id,
        DesafioDiario.created_at >= hoy
    ).first()
    
    if not desafio:
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        perfil = usuario.perfil
        user_info = {
            "nombre": usuario.nombre,
            "nivel": perfil.nivel if perfil else 1,
            "intereses": [i.interes for i in usuario.intereses] if usuario.intereses else ["Python"],
            "lenguajes": [l.lenguaje for l in usuario.lenguajes] if usuario.lenguajes else ["Python"]
        }
        desafio = await ia_service.generar_y_guardar_desafio(usuario_id, user_info)
    
    # Serializar el desafío con nombres de campos amigables para el frontend
    return serialize_desafio(desafio)


def serialize_desafio(desafio) -> dict:
    """Convierte un objeto DesafioDiario a diccionario con nombres amigables para el frontend."""
    if desafio is None:
        return None
    
    def parse_json_field(value, default):
        """Parsea un campo que puede ser string JSON o ya un dict/list."""
        if value is None:
            return default
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return default
        return value
    
    return {
        "id": str(desafio.id),
        "usuario_id": str(desafio.usuario_id),
        "titulo": desafio.titulo,
        "lenguaje_recomendado": desafio.lenguaje_recomendado,
        "contexto_negocio": desafio.contexto_negocio,
        "definicion_problema": desafio.definicion_problema,
        "templates_lenguajes": parse_json_field(desafio.templates_lenguajes_json, {}),
        "restricciones": parse_json_field(desafio.restricciones_json, {}),
        "casos_prueba": parse_json_field(desafio.casos_prueba_json, []),
        "pista": desafio.pista,
        "estado": desafio.estado,
        "dificultad": desafio.dificultad,
        "xp_recompensa": desafio.xp_recompensa,
        "created_at": desafio.created_at.isoformat() if desafio.created_at else None,
        "completado_at": desafio.completado_at.isoformat() if desafio.completado_at else None,
    }


@router.post("/generar")
async def generar_nuevo_desafio(
    usuario_id: str,
    db: Annotated[Session, Depends(get_db)],
    ia_service: Annotated[IAService, Depends(get_ia_service)]
):
    from app.models.db_models import Usuario
    
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    perfil = usuario.perfil
    user_info = {
        "nombre": usuario.nombre,
        "nivel": perfil.nivel if perfil else 1,
        "intereses": [i.interes for i in usuario.intereses] if usuario.intereses else ["Python", "Algoritmos"],
        "lenguajes": [l.lenguaje for l in usuario.lenguajes] if usuario.lenguajes else ["Python", "JavaScript"]
    }
    
    desafio = await ia_service.generar_y_guardar_desafio(usuario_id, user_info)
    
    if not desafio:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al generar el desafío"
        )
    
    return {
        "status": "success",
        "desafio": serialize_desafio(desafio),
        "message": "Desafío generado exitosamente"
    }


@router.get("/historial")
async def obtener_historial(
    usuario_id: str,
    db: Annotated[Session, Depends(get_db)],
    estado: str | None = None,
    limite: int = 20,
    skip: int = 0
):
    from app.models.db_models import DesafioDiario
    
    query = db.query(DesafioDiario).filter(
        DesafioDiario.usuario_id == usuario_id
    )
    
    if estado:
        query = query.filter(DesafioDiario.estado == estado)
    
    desafios = query.order_by(
        DesafioDiario.created_at.desc()
    ).offset(skip).limit(limite).all()
    
    return desafios


@router.post("/{desafio_id}/completar")
async def marcar_completado(
    desafio_id: str,
    usuario_id: str,
    db: Annotated[Session, Depends(get_db)]
):
    from app.models.db_models import DesafioDiario
    from datetime import datetime
    
    desafio = db.query(DesafioDiario).filter(
        DesafioDiario.id == desafio_id,
        DesafioDiario.usuario_id == usuario_id
    ).first()
    
    if not desafio:
        raise HTTPException(status_code=404, detail="Desafío no encontrado")
    
    desafio.estado = 'completado'
    desafio.completado_at = datetime.now()
    db.commit()
    
    return {"message": "Desafío completado exitosamente"}


@router.post("/{desafio_id}/abandonar")
async def marcar_abandonado(
    desafio_id: str,
    usuario_id: str,
    db: Annotated[Session, Depends(get_db)]
):
    from app.models.db_models import DesafioDiario
    
    desafio = db.query(DesafioDiario).filter(
        DesafioDiario.id == desafio_id,
        DesafioDiario.usuario_id == usuario_id
    ).first()
    
    if not desafio:
        raise HTTPException(status_code=404, detail="Desafío no encontrado")
    
    desafio.estado = 'abandonado'
    db.commit()
    
    return {"message": "Desafío marcado como abandonado"}


class EjecutarCodigoRequest(BaseModel):
    codigo: str
    lenguaje: str


@router.post("/{desafio_id}/ejecutar")
async def ejecutar_codigo_desafio(
    desafio_id: str,
    usuario_id: str,
    request: EjecutarCodigoRequest,
    db: Annotated[Session, Depends(get_db)]
):
    """
    Ejecuta el código del usuario contra los casos de prueba del desafío.
    """
    from app.models.db_models import DesafioDiario
    
    # Obtener el desafío
    desafio = db.query(DesafioDiario).filter(
        DesafioDiario.id == desafio_id,
        DesafioDiario.usuario_id == usuario_id
    ).first()
    
    if not desafio:
        raise HTTPException(status_code=404, detail="Desafío no encontrado")
    
    # Obtener casos de prueba
    casos_prueba = desafio.casos_prueba_json or []
    
    if not casos_prueba:
        raise HTTPException(
            status_code=400,
            detail="No hay casos de prueba definidos para este desafío"
        )
    
    # Ejecutar el código
    resultados = ejecutar_codigo(
        codigo=request.codigo,
        lenguaje=request.lenguaje,
        casos_prueba=casos_prueba
    )
    
    return {
        "status": "success" if resultados["exito"] else "error",
        "resultados": resultados
    }
