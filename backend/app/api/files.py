"""
文件管理API路由
"""
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from ..models.file_models import (
    DirectoryResponse, 
    DirectoryTreeNode, 
    FileItem, 
    SystemDrive,
    ErrorResponse
)
from ..services.file_service import FileService

router = APIRouter(prefix="/api/files", tags=["files"])


@router.get("/list", response_model=DirectoryResponse)
async def list_files(
    path: str = Query(..., description="目录路径"),
    sort_by: str = Query("name", description="排序字段: name, size, modified_time, type"),
    sort_order: str = Query("asc", description="排序顺序: asc, desc")
):
    """获取目录文件列表"""
    try:
        result = FileService.list_directory(path, sort_by, sort_order)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/tree", response_model=DirectoryTreeNode)
async def get_directory_tree(
    path: str = Query(..., description="根目录路径"),
    max_depth: int = Query(3, description="最大深度", ge=1, le=5)
):
    """获取目录树结构"""
    try:
        result = FileService.get_directory_tree(path, max_depth)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/info", response_model=FileItem)
async def get_file_info(
    path: str = Query(..., description="文件路径")
):
    """获取文件详细信息"""
    try:
        result = FileService.get_file_info(path)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/drives", response_model=List[SystemDrive])
async def get_system_drives():
    """获取系统驱动器列表"""
    try:
        result = FileService.get_system_drives()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok", "message": "File service is running"}


# 错误处理
@router.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """通用异常处理"""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="InternalServerError",
            message="服务器内部错误",
            details=str(exc)
        ).model_dump()
    )
