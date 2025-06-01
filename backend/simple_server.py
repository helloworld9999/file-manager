"""
简化版文件管理服务器
"""
import os
import json
from datetime import datetime
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import mimetypes

class FileManagerHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """处理GET请求"""
        try:
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            query_params = parse_qs(parsed_url.query)
            
            # 设置CORS头
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            if path == '/api/files/list':
                self.handle_list_files(query_params)
            elif path == '/api/files/drives':
                self.handle_get_drives()
            elif path == '/health':
                self.handle_health()
            else:
                self.send_error_response("Not Found", 404)
                
        except Exception as e:
            self.send_error_response(str(e), 500)
    
    def do_OPTIONS(self):
        """处理OPTIONS请求（CORS预检）"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def handle_list_files(self, query_params):
        """处理文件列表请求"""
        try:
            path_param = query_params.get('path', ['C:\\'])[0]
            target_path = Path(path_param)
            
            if not target_path.exists() or not target_path.is_dir():
                self.send_error_response("目录不存在", 400)
                return
            
            items = []
            total_size = 0
            
            for item in target_path.iterdir():
                try:
                    stat_info = item.stat()
                    file_type = self.get_file_type(item)
                    
                    file_item = {
                        "name": item.name,
                        "path": str(item),
                        "size": stat_info.st_size if item.is_file() else 0,
                        "modified_time": datetime.fromtimestamp(stat_info.st_mtime).isoformat(),
                        "is_directory": item.is_dir(),
                        "file_type": file_type,
                        "extension": item.suffix if item.is_file() else None,
                        "permissions": "rw"
                    }
                    
                    items.append(file_item)
                    if item.is_file():
                        total_size += stat_info.st_size
                        
                except (PermissionError, OSError):
                    continue
            
            # 排序：目录优先，然后按名称
            items.sort(key=lambda x: (not x["is_directory"], x["name"].lower()))
            
            parent_path = str(target_path.parent) if target_path.parent != target_path else None
            
            response = {
                "current_path": str(target_path),
                "parent_path": parent_path,
                "items": items,
                "total_count": len(items),
                "total_size": total_size
            }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_error_response(f"获取文件列表失败: {str(e)}", 500)
    
    def handle_get_drives(self):
        """处理获取驱动器请求"""
        try:
            drives = []
            
            # Windows系统
            if os.name == 'nt':
                import string
                import shutil
                
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
            
            self.wfile.write(json.dumps(drives, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_error_response(f"获取驱动器失败: {str(e)}", 500)
    
    def handle_health(self):
        """健康检查"""
        response = {"status": "ok", "message": "File service is running"}
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
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
    
    def send_error_response(self, message, status_code=500):
        """发送错误响应"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {
            "error": "Error",
            "message": message
        }
        self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))

def run_server():
    """启动服务器"""
    server_address = ('127.0.0.1', 8000)
    httpd = HTTPServer(server_address, FileManagerHandler)
    print("🚀 文件管理服务器启动成功!")
    print("📍 服务地址: http://127.0.0.1:8000")
    print("🔍 健康检查: http://127.0.0.1:8000/health")
    print("⚡ 按 Ctrl+C 停止服务")
    print("-" * 50)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
