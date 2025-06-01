#!/usr/bin/env python3
"""
启动文件管理系统后端服务
"""
import os
import sys
import json
import shutil
import platform
from datetime import datetime
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote

class FileManagerHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """处理CORS预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        """处理GET请求"""
        try:
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            query_params = parse_qs(parsed_url.query)
            
            # 设置响应头
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()
            
            # 路由处理
            if path == '/api/files/list':
                self.handle_list_files(query_params)
            elif path == '/api/files/drives':
                self.handle_get_drives()
            elif path == '/api/files/tree':
                self.handle_get_tree(query_params)
            elif path == '/api/files/info':
                self.handle_get_file_info(query_params)
            elif path == '/api/files/content':
                self.handle_get_file_content(query_params)
            elif path == '/health':
                self.handle_health()
            else:
                self.send_error_response("API endpoint not found", 404)
                
        except Exception as e:
            print(f"Error handling GET request: {e}")
            self.send_error_response(str(e), 500)

    def do_POST(self):
        """处理POST请求"""
        try:
            parsed_url = urlparse(self.path)
            path = parsed_url.path

            # 读取请求体
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')

            # 设置响应头
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()

            # 路由处理
            if path == '/api/files/save':
                self.handle_save_file(post_data)
            elif path == '/api/files/create':
                self.handle_create_file(post_data)
            elif path == '/api/files/mkdir':
                self.handle_create_directory(post_data)
            else:
                self.send_error_response("API endpoint not found", 404)

        except Exception as e:
            print(f"Error handling POST request: {e}")
            self.send_error_response(str(e), 500)

    def do_DELETE(self):
        """处理DELETE请求"""
        try:
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            query_params = parse_qs(parsed_url.query)

            # 设置响应头
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()

            # 路由处理
            if path == '/api/files/delete':
                self.handle_delete_file(query_params)
            else:
                self.send_error_response("API endpoint not found", 404)

        except Exception as e:
            print(f"Error handling DELETE request: {e}")
            self.send_error_response(str(e), 500)

    def handle_list_files(self, query_params):
        """处理文件列表请求"""
        try:
            # 获取参数
            path_param = query_params.get('path', ['C:\\'])[0]
            sort_by = query_params.get('sort_by', ['name'])[0]
            sort_order = query_params.get('sort_order', ['asc'])[0]
            
            # URL解码路径
            path_param = unquote(path_param)
            target_path = Path(path_param)
            
            print(f"Listing files in: {target_path}")
            
            if not target_path.exists():
                self.send_error_response(f"路径不存在: {target_path}", 400)
                return
                
            if not target_path.is_dir():
                self.send_error_response(f"路径不是目录: {target_path}", 400)
                return
            
            items = []
            total_size = 0
            
            # 遍历目录
            try:
                for item in target_path.iterdir():
                    try:
                        stat_info = item.stat()
                        
                        file_item = {
                            "name": item.name,
                            "path": str(item).replace('\\', '/'),  # 统一使用正斜杠
                            "size": stat_info.st_size if item.is_file() else 0,
                            "modified_time": datetime.fromtimestamp(stat_info.st_mtime).isoformat(),
                            "is_directory": item.is_dir(),
                            "file_type": self.get_file_type(item),
                            "extension": item.suffix if item.is_file() else None,
                            "permissions": "rw"
                        }
                        
                        items.append(file_item)
                        if item.is_file():
                            total_size += stat_info.st_size
                            
                    except (PermissionError, OSError) as e:
                        print(f"Skipping {item}: {e}")
                        continue
                        
            except PermissionError:
                self.send_error_response("没有权限访问此目录", 403)
                return
            
            # 排序
            items = self.sort_items(items, sort_by, sort_order)
            
            # 获取父目录
            parent_path = None
            if target_path.parent != target_path:
                parent_path = str(target_path.parent).replace('\\', '/')
            
            response = {
                "current_path": str(target_path).replace('\\', '/'),
                "parent_path": parent_path,
                "items": items,
                "total_count": len(items),
                "total_size": total_size
            }
            
            self.write_json_response(response)
            
        except Exception as e:
            print(f"Error in handle_list_files: {e}")
            self.send_error_response(f"获取文件列表失败: {str(e)}", 500)

    def handle_get_drives(self):
        """处理获取驱动器请求"""
        try:
            drives = []
            
            if platform.system() == "Windows":
                import string
                for letter in string.ascii_uppercase:
                    drive_path = f"{letter}:\\"
                    if os.path.exists(drive_path):
                        try:
                            total, used, free = shutil.disk_usage(drive_path)
                            drives.append({
                                "letter": letter,
                                "label": f"本地磁盘 ({letter}:)",
                                "total_space": total,
                                "free_space": free,
                                "drive_type": "local"
                            })
                        except (PermissionError, OSError):
                            continue
            else:
                # Linux/Mac
                total, used, free = shutil.disk_usage("/")
                drives.append({
                    "letter": "/",
                    "label": "根目录",
                    "total_space": total,
                    "free_space": free,
                    "drive_type": "local"
                })
            
            self.write_json_response(drives)
            
        except Exception as e:
            self.send_error_response(f"获取驱动器失败: {str(e)}", 500)

    def handle_get_tree(self, query_params):
        """处理目录树请求"""
        try:
            path_param = query_params.get('path', ['C:\\'])[0]
            max_depth = int(query_params.get('max_depth', [2])[0])
            
            path_param = unquote(path_param)
            target_path = Path(path_param)
            
            if not target_path.exists() or not target_path.is_dir():
                self.send_error_response("目录不存在", 400)
                return
            
            tree_node = self.build_tree_node(target_path, max_depth, 0)
            self.write_json_response(tree_node)
            
        except Exception as e:
            self.send_error_response(f"获取目录树失败: {str(e)}", 500)

    def handle_get_file_info(self, query_params):
        """处理文件信息请求"""
        try:
            path_param = query_params.get('path', [''])[0]
            if not path_param:
                self.send_error_response("缺少path参数", 400)
                return
                
            path_param = unquote(path_param)
            target_path = Path(path_param)
            
            if not target_path.exists():
                self.send_error_response("文件不存在", 404)
                return
            
            stat_info = target_path.stat()
            file_info = {
                "name": target_path.name,
                "path": str(target_path).replace('\\', '/'),
                "size": stat_info.st_size if target_path.is_file() else 0,
                "modified_time": datetime.fromtimestamp(stat_info.st_mtime).isoformat(),
                "is_directory": target_path.is_dir(),
                "file_type": self.get_file_type(target_path),
                "extension": target_path.suffix if target_path.is_file() else None,
                "permissions": "rw"
            }
            
            self.write_json_response(file_info)
            
        except Exception as e:
            self.send_error_response(f"获取文件信息失败: {str(e)}", 500)

    def handle_health(self):
        """健康检查"""
        response = {
            "status": "ok", 
            "message": "File manager service is running",
            "version": "1.0.0"
        }
        self.write_json_response(response)

    def build_tree_node(self, path, max_depth, current_depth):
        """构建目录树节点"""
        node = {
            "name": path.name if path.name else str(path),
            "path": str(path).replace('\\', '/'),
            "children": [],
            "is_expanded": current_depth == 0
        }
        
        if current_depth >= max_depth:
            return node
        
        try:
            for item in path.iterdir():
                if item.is_dir():
                    try:
                        child_node = self.build_tree_node(item, max_depth, current_depth + 1)
                        node["children"].append(child_node)
                    except (PermissionError, OSError):
                        continue
            
            # 按名称排序
            node["children"].sort(key=lambda x: x["name"].lower())
            
        except (PermissionError, OSError):
            pass
        
        return node

    def get_file_type(self, file_path):
        """获取文件类型"""
        if file_path.is_dir():
            return "directory"
        
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

    def sort_items(self, items, sort_by, sort_order):
        """排序文件项"""
        reverse = sort_order.lower() == "desc"
        
        if sort_by == "name":
            items.sort(key=lambda x: (not x["is_directory"], x["name"].lower()), reverse=reverse)
        elif sort_by == "size":
            items.sort(key=lambda x: (not x["is_directory"], x["size"]), reverse=reverse)
        elif sort_by == "modified_time":
            items.sort(key=lambda x: (not x["is_directory"], x["modified_time"]), reverse=reverse)
        elif sort_by == "type":
            items.sort(key=lambda x: (not x["is_directory"], x["file_type"], x["name"].lower()), reverse=reverse)
        
        return items

    def write_json_response(self, data):
        """写入JSON响应"""
        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        self.wfile.write(json_data.encode('utf-8'))

    def send_error_response(self, message, status_code=500):
        """发送错误响应"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {
            "error": "Error",
            "message": message
        }
        self.write_json_response(error_response)

    def handle_get_file_content(self, query_params):
        """处理获取文件内容请求"""
        try:
            path_param = query_params.get('path', [''])[0]
            if not path_param:
                self.send_error_response("缺少path参数", 400)
                return

            path_param = unquote(path_param)
            target_path = Path(path_param)

            print(f"Reading file content: {target_path}")

            if not target_path.exists():
                self.send_error_response("文件不存在", 404)
                return

            if not target_path.is_file():
                self.send_error_response("指定路径不是文件", 400)
                return

            # 检查文件大小（限制为10MB）
            file_size = target_path.stat().st_size
            if file_size > 10 * 1024 * 1024:
                self.send_error_response("文件太大，无法编辑（限制10MB）", 400)
                return

            # 尝试读取文件内容
            try:
                # 首先尝试UTF-8编码
                with open(target_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                encoding = 'utf-8'
            except UnicodeDecodeError:
                try:
                    # 如果UTF-8失败，尝试GBK编码
                    with open(target_path, 'r', encoding='gbk') as f:
                        content = f.read()
                    encoding = 'gbk'
                except UnicodeDecodeError:
                    # 如果都失败，尝试latin-1编码
                    with open(target_path, 'r', encoding='latin-1') as f:
                        content = f.read()
                    encoding = 'latin-1'

            response = {
                "path": str(target_path).replace('\\', '/'),
                "content": content,
                "encoding": encoding,
                "size": file_size,
                "is_editable": self.is_editable_file(target_path)
            }

            self.write_json_response(response)

        except Exception as e:
            print(f"Error reading file content: {e}")
            self.send_error_response(f"读取文件内容失败: {str(e)}", 500)

    def handle_save_file(self, post_data):
        """处理保存文件请求"""
        try:
            data = json.loads(post_data)
            file_path = data.get('path', '')
            content = data.get('content', '')
            encoding = data.get('encoding', 'utf-8')

            if not file_path:
                self.send_error_response("缺少文件路径", 400)
                return

            target_path = Path(unquote(file_path))
            print(f"Saving file: {target_path}")

            # 创建目录（如果不存在）
            target_path.parent.mkdir(parents=True, exist_ok=True)

            # 保存文件
            with open(target_path, 'w', encoding=encoding) as f:
                f.write(content)

            response = {
                "success": True,
                "message": "文件保存成功",
                "path": str(target_path).replace('\\', '/'),
                "size": len(content.encode(encoding))
            }

            self.write_json_response(response)

        except Exception as e:
            print(f"Error saving file: {e}")
            self.send_error_response(f"保存文件失败: {str(e)}", 500)

    def handle_create_file(self, post_data):
        """处理创建新文件请求"""
        try:
            data = json.loads(post_data)
            file_path = data.get('path', '')
            content = data.get('content', '')

            if not file_path:
                self.send_error_response("缺少文件路径", 400)
                return

            target_path = Path(unquote(file_path))
            print(f"Creating file: {target_path}")

            if target_path.exists():
                self.send_error_response("文件已存在", 400)
                return

            # 创建目录（如果不存在）
            target_path.parent.mkdir(parents=True, exist_ok=True)

            # 创建文件
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(content)

            response = {
                "success": True,
                "message": "文件创建成功",
                "path": str(target_path).replace('\\', '/')
            }

            self.write_json_response(response)

        except Exception as e:
            print(f"Error creating file: {e}")
            self.send_error_response(f"创建文件失败: {str(e)}", 500)

    def handle_create_directory(self, post_data):
        """处理创建目录请求"""
        try:
            data = json.loads(post_data)
            dir_path = data.get('path', '')

            if not dir_path:
                self.send_error_response("缺少目录路径", 400)
                return

            target_path = Path(unquote(dir_path))
            print(f"Creating directory: {target_path}")

            if target_path.exists():
                self.send_error_response("目录已存在", 400)
                return

            # 创建目录
            target_path.mkdir(parents=True, exist_ok=True)

            response = {
                "success": True,
                "message": "目录创建成功",
                "path": str(target_path).replace('\\', '/')
            }

            self.write_json_response(response)

        except Exception as e:
            print(f"Error creating directory: {e}")
            self.send_error_response(f"创建目录失败: {str(e)}", 500)

    def handle_delete_file(self, query_params):
        """处理删除文件请求"""
        try:
            path_param = query_params.get('path', [''])[0]
            if not path_param:
                self.send_error_response("缺少path参数", 400)
                return

            path_param = unquote(path_param)
            target_path = Path(path_param)

            print(f"Deleting: {target_path}")

            if not target_path.exists():
                self.send_error_response("文件或目录不存在", 404)
                return

            if target_path.is_file():
                target_path.unlink()
            else:
                shutil.rmtree(target_path)

            response = {
                "success": True,
                "message": "删除成功",
                "path": str(target_path).replace('\\', '/')
            }

            self.write_json_response(response)

        except Exception as e:
            print(f"Error deleting file: {e}")
            self.send_error_response(f"删除失败: {str(e)}", 500)

    def is_editable_file(self, file_path):
        """检查文件是否可编辑"""
        editable_extensions = ['.txt', '.json', '.md', '.xml', '.yaml', '.yml', '.log', '.csv', '.ini', '.cfg', '.conf']
        return file_path.suffix.lower() in editable_extensions

def main():
    """启动服务器"""
    host = '127.0.0.1'
    port = 8000
    
    server_address = (host, port)
    httpd = HTTPServer(server_address, FileManagerHandler)
    
    print("🚀 文件管理系统后端服务启动成功!")
    print(f"📍 服务地址: http://{host}:{port}")
    print(f"🔍 健康检查: http://{host}:{port}/health")
    print(f"📁 文件列表API: http://{host}:{port}/api/files/list?path=C:\\")
    print("⚡ 按 Ctrl+C 停止服务")
    print("-" * 60)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ 服务器已停止")
        httpd.server_close()

if __name__ == "__main__":
    main()
