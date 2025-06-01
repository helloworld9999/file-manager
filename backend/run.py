"""
后端服务启动脚本
"""
import uvicorn
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 启动文件管理系统后端服务...")
    print("📍 API文档地址: http://127.0.0.1:8000/docs")
    print("🔍 健康检查: http://127.0.0.1:8000/health")
    print("⚡ 按 Ctrl+C 停止服务")
    print("-" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )
