#!/usr/bin/env python3
"""
文件管理系统部署脚本
"""
import os
import sys
import subprocess
import platform
from pathlib import Path

def check_python_version():
    """检查Python版本"""
    if sys.version_info < (3, 7):
        print("❌ 需要Python 3.7或更高版本")
        sys.exit(1)
    print(f"✅ Python版本: {sys.version}")

def install_dependencies():
    """安装依赖"""
    print("📦 安装Python依赖...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", "pip"], check=True)
        print("✅ pip已更新")
    except subprocess.CalledProcessError:
        print("⚠️ pip更新失败，继续安装依赖")
    
    # 这里不需要安装额外依赖，因为我们使用的是Python标准库
    print("✅ 所有依赖已就绪（使用Python标准库）")

def check_port(port=8000):
    """检查端口是否可用"""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        result = s.connect_ex(('127.0.0.1', port))
        if result == 0:
            print(f"⚠️ 端口 {port} 已被占用")
            return False
        else:
            print(f"✅ 端口 {port} 可用")
            return True

def create_desktop_shortcut():
    """创建桌面快捷方式"""
    try:
        if platform.system() == "Windows":
            import winshell
            from win32com.client import Dispatch
            
            desktop = winshell.desktop()
            path = os.path.join(desktop, "文件管理系统.lnk")
            target = os.path.join(os.getcwd(), "start_backend.py")
            wDir = os.getcwd()
            icon = target
            
            shell = Dispatch('WScript.Shell')
            shortcut = shell.CreateShortCut(path)
            shortcut.Targetpath = sys.executable
            shortcut.Arguments = f'"{target}"'
            shortcut.WorkingDirectory = wDir
            shortcut.IconLocation = icon
            shortcut.save()
            
            print("✅ 桌面快捷方式已创建")
    except ImportError:
        print("⚠️ 无法创建桌面快捷方式（缺少依赖）")
    except Exception as e:
        print(f"⚠️ 创建桌面快捷方式失败: {e}")

def create_start_script():
    """创建启动脚本"""
    if platform.system() == "Windows":
        script_content = f"""@echo off
cd /d "{os.getcwd()}"
python start_backend.py
pause
"""
        with open("启动文件管理系统.bat", "w", encoding="utf-8") as f:
            f.write(script_content)
        print("✅ 启动脚本已创建: 启动文件管理系统.bat")
    else:
        script_content = f"""#!/bin/bash
cd "{os.getcwd()}"
python3 start_backend.py
"""
        with open("start_file_manager.sh", "w") as f:
            f.write(script_content)
        os.chmod("start_file_manager.sh", 0o755)
        print("✅ 启动脚本已创建: start_file_manager.sh")

def show_usage_info():
    """显示使用说明"""
    print("\n" + "="*60)
    print("🎉 文件管理系统部署完成！")
    print("="*60)
    print("\n📋 使用方法:")
    print("1. 启动后端服务:")
    print("   python start_backend.py")
    print("\n2. 在浏览器中打开:")
    print("   file-manager-advanced.html")
    print("\n3. 或者使用启动脚本:")
    if platform.system() == "Windows":
        print("   双击 '启动文件管理系统.bat'")
    else:
        print("   ./start_file_manager.sh")
    
    print("\n🌐 访问地址:")
    print("   后端API: http://127.0.0.1:8000")
    print("   健康检查: http://127.0.0.1:8000/health")
    
    print("\n📚 更多信息:")
    print("   查看 README.md 了解详细使用说明")
    print("   查看 CONTRIBUTING.md 了解如何贡献代码")
    print("\n" + "="*60)

def main():
    """主函数"""
    print("🚀 开始部署文件管理系统...")
    print("-" * 40)
    
    # 检查环境
    check_python_version()
    
    # 安装依赖
    install_dependencies()
    
    # 检查端口
    check_port()
    
    # 创建启动脚本
    create_start_script()
    
    # 尝试创建桌面快捷方式
    create_desktop_shortcut()
    
    # 显示使用说明
    show_usage_info()

if __name__ == "__main__":
    main()
