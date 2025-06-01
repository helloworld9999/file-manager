"""
文件系统数据模型定义
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class FileItem(BaseModel):
    """文件项模型"""
    name: str = Field(..., description="文件名")
    path: str = Field(..., description="完整路径")
    size: int = Field(..., description="文件大小（字节）")
    modified_time: datetime = Field(..., description="修改时间")
    is_directory: bool = Field(..., description="是否为目录")
    file_type: str = Field(..., description="文件类型")
    extension: Optional[str] = Field(None, description="文件扩展名")
    permissions: str = Field(..., description="权限信息")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class DirectoryResponse(BaseModel):
    """目录响应模型"""
    current_path: str = Field(..., description="当前路径")
    parent_path: Optional[str] = Field(None, description="父级路径")
    items: List[FileItem] = Field(..., description="文件项列表")
    total_count: int = Field(..., description="总文件数")
    total_size: int = Field(..., description="总大小")


class DirectoryTreeNode(BaseModel):
    """目录树节点模型"""
    name: str = Field(..., description="目录名")
    path: str = Field(..., description="完整路径")
    children: List['DirectoryTreeNode'] = Field(default_factory=list, description="子目录")
    is_expanded: bool = Field(False, description="是否展开")


class FileOperationRequest(BaseModel):
    """文件操作请求模型"""
    source_path: str = Field(..., description="源路径")
    target_path: Optional[str] = Field(None, description="目标路径")
    operation: str = Field(..., description="操作类型: copy, move, delete, rename")


class SystemDrive(BaseModel):
    """系统驱动器模型"""
    letter: str = Field(..., description="驱动器字母")
    label: Optional[str] = Field(None, description="驱动器标签")
    total_space: int = Field(..., description="总空间")
    free_space: int = Field(..., description="可用空间")
    drive_type: str = Field(..., description="驱动器类型")


class ErrorResponse(BaseModel):
    """错误响应模型"""
    error: str = Field(..., description="错误类型")
    message: str = Field(..., description="错误消息")
    details: Optional[str] = Field(None, description="错误详情")


# 更新前向引用
DirectoryTreeNode.model_rebuild()
