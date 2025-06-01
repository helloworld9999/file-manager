"""
文件系统服务
"""
import os
import stat
import platform
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Tuple
import mimetypes

from ..models.file_models import FileItem, DirectoryResponse, DirectoryTreeNode, SystemDrive


class FileService:
    """文件系统服务类"""
    
    @staticmethod
    def get_file_type(file_path: Path) -> str:
        """获取文件类型"""
        if file_path.is_dir():
            return "directory"
        
        # 获取MIME类型
        mime_type, _ = mimetypes.guess_type(str(file_path))
        if mime_type:
            main_type = mime_type.split('/')[0]
            return main_type
        
        # 根据扩展名判断
        suffix = file_path.suffix.lower()
        if suffix in ['.txt', '.md', '.log']:
            return "text"
        elif suffix in ['.json', '.xml', '.yaml', '.yml']:
            return "code"
        elif suffix in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']:
            return "image"
        elif suffix in ['.mp4', '.avi', '.mov', '.wmv', '.flv']:
            return "video"
        elif suffix in ['.mp3', '.wav', '.flac', '.aac']:
            return "audio"
        elif suffix in ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']:
            return "document"
        elif suffix in ['.zip', '.rar', '.7z', '.tar', '.gz']:
            return "archive"
        else:
            return "file"
    
    @staticmethod
    def get_permissions(file_path: Path) -> str:
        """获取文件权限"""
        try:
            file_stat = file_path.stat()
            mode = file_stat.st_mode
            
            # 简化的权限表示
            permissions = []
            if mode & stat.S_IRUSR:
                permissions.append('r')
            if mode & stat.S_IWUSR:
                permissions.append('w')
            if mode & stat.S_IXUSR:
                permissions.append('x')
                
            return ''.join(permissions) if permissions else 'none'
        except:
            return 'unknown'
    
    @staticmethod
    def safe_path(path_str: str) -> Path:
        """安全路径处理"""
        try:
            path = Path(path_str).resolve()
            # 确保路径存在且可访问
            if not path.exists():
                raise FileNotFoundError(f"路径不存在: {path}")
            return path
        except Exception as e:
            raise ValueError(f"无效路径: {path_str}, 错误: {str(e)}")
    
    @classmethod
    def list_directory(cls, path_str: str, sort_by: str = "name", 
                      sort_order: str = "asc") -> DirectoryResponse:
        """列出目录内容"""
        try:
            current_path = cls.safe_path(path_str)
            
            if not current_path.is_dir():
                raise ValueError("指定路径不是目录")
            
            items = []
            total_size = 0
            
            # 遍历目录内容
            for item_path in current_path.iterdir():
                try:
                    stat_info = item_path.stat()
                    
                    file_item = FileItem(
                        name=item_path.name,
                        path=str(item_path),
                        size=stat_info.st_size if item_path.is_file() else 0,
                        modified_time=datetime.fromtimestamp(stat_info.st_mtime),
                        is_directory=item_path.is_dir(),
                        file_type=cls.get_file_type(item_path),
                        extension=item_path.suffix if item_path.is_file() else None,
                        permissions=cls.get_permissions(item_path)
                    )
                    
                    items.append(file_item)
                    if item_path.is_file():
                        total_size += stat_info.st_size
                        
                except (PermissionError, OSError):
                    # 跳过无法访问的文件
                    continue
            
            # 排序
            items = cls._sort_items(items, sort_by, sort_order)
            
            # 获取父目录路径
            parent_path = str(current_path.parent) if current_path.parent != current_path else None
            
            return DirectoryResponse(
                current_path=str(current_path),
                parent_path=parent_path,
                items=items,
                total_count=len(items),
                total_size=total_size
            )
            
        except Exception as e:
            raise Exception(f"列出目录失败: {str(e)}")
    
    @staticmethod
    def _sort_items(items: List[FileItem], sort_by: str, sort_order: str) -> List[FileItem]:
        """排序文件项"""
        reverse = sort_order.lower() == "desc"
        
        if sort_by == "name":
            # 目录优先，然后按名称排序
            items.sort(key=lambda x: (not x.is_directory, x.name.lower()), reverse=reverse)
        elif sort_by == "size":
            items.sort(key=lambda x: (not x.is_directory, x.size), reverse=reverse)
        elif sort_by == "modified_time":
            items.sort(key=lambda x: (not x.is_directory, x.modified_time), reverse=reverse)
        elif sort_by == "type":
            items.sort(key=lambda x: (not x.is_directory, x.file_type, x.name.lower()), reverse=reverse)
        
        return items

    @classmethod
    def get_directory_tree(cls, root_path: str, max_depth: int = 3) -> DirectoryTreeNode:
        """获取目录树结构"""
        try:
            root = cls.safe_path(root_path)

            if not root.is_dir():
                raise ValueError("指定路径不是目录")

            return cls._build_tree_node(root, max_depth, 0)

        except Exception as e:
            raise Exception(f"获取目录树失败: {str(e)}")

    @classmethod
    def _build_tree_node(cls, path: Path, max_depth: int, current_depth: int) -> DirectoryTreeNode:
        """构建目录树节点"""
        node = DirectoryTreeNode(
            name=path.name if path.name else str(path),
            path=str(path),
            children=[],
            is_expanded=current_depth == 0  # 只展开根节点
        )

        # 如果达到最大深度，不再递归
        if current_depth >= max_depth:
            return node

        try:
            # 只添加目录到树中
            for item in path.iterdir():
                if item.is_dir():
                    try:
                        child_node = cls._build_tree_node(item, max_depth, current_depth + 1)
                        node.children.append(child_node)
                    except (PermissionError, OSError):
                        # 跳过无法访问的目录
                        continue

            # 按名称排序子目录
            node.children.sort(key=lambda x: x.name.lower())

        except (PermissionError, OSError):
            # 无法访问目录内容
            pass

        return node

    @staticmethod
    def get_system_drives() -> List[SystemDrive]:
        """获取系统驱动器列表"""
        drives = []

        if platform.system() == "Windows":
            import string
            import shutil

            for letter in string.ascii_uppercase:
                drive_path = f"{letter}:\\"
                if os.path.exists(drive_path):
                    try:
                        total, used, free = shutil.disk_usage(drive_path)

                        # 尝试获取驱动器标签
                        try:
                            import win32api
                            label = win32api.GetVolumeInformation(drive_path)[0]
                        except:
                            label = None

                        drives.append(SystemDrive(
                            letter=letter,
                            label=label,
                            total_space=total,
                            free_space=free,
                            drive_type="local"
                        ))
                    except (PermissionError, OSError):
                        continue
        else:
            # Linux/Mac 系统
            import shutil
            root_path = "/"
            if os.path.exists(root_path):
                total, used, free = shutil.disk_usage(root_path)
                drives.append(SystemDrive(
                    letter="/",
                    label="Root",
                    total_space=total,
                    free_space=free,
                    drive_type="local"
                ))

        return drives

    @classmethod
    def get_file_info(cls, path_str: str) -> FileItem:
        """获取单个文件信息"""
        try:
            file_path = cls.safe_path(path_str)
            stat_info = file_path.stat()

            return FileItem(
                name=file_path.name,
                path=str(file_path),
                size=stat_info.st_size if file_path.is_file() else 0,
                modified_time=datetime.fromtimestamp(stat_info.st_mtime),
                is_directory=file_path.is_dir(),
                file_type=cls.get_file_type(file_path),
                extension=file_path.suffix if file_path.is_file() else None,
                permissions=cls.get_permissions(file_path)
            )

        except Exception as e:
            raise Exception(f"获取文件信息失败: {str(e)}")
