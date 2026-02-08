from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated
from pydantic import BaseModel
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
    
    return desafio


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
        "desafio": desafio,
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
