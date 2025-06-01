#!/usr/bin/env python3
"""
文件管理系统快速启动脚本
"""
import os
import sys
import time
import webbrowser
import subprocess
from pathlib import Path

def print_banner():
    """打印启动横幅"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                    🗂️ 文件管理系统                           ║
    ║                  File Manager System                        ║
    ║                                                              ║
    ║  一个现代化的文件管理和编辑系统                                ║
    ║  A modern file management and editing system                ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_requirements():
    """检查系统要求"""
    print("🔍 检查系统要求...")
    
    # 检查Python版本
    if sys.version_info < (3, 7):
        print("❌ 需要Python 3.7或更高版本")
        print(f"   当前版本: {sys.version}")
        return False
    
    print(f"✅ Python版本: {sys.version.split()[0]}")
    
    # 检查必要文件
    required_files = [
        "start_backend.py",
        "file-manager-advanced.html",
        "README.md"
    ]
    
    for file in required_files:
        if not Path(file).exists():
            print(f"❌ 缺少必要文件: {file}")
            return False
    
    print("✅ 所有必要文件存在")
    return True

def start_backend():
    """启动后端服务"""
    print("\n🚀 启动后端服务...")
    
    try:
        # 启动后端服务
        process = subprocess.Popen(
            [sys.executable, "start_backend.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # 等待服务启动
        print("⏳ 等待服务启动...")
        time.sleep(3)
        
        # 检查服务是否正常运行
        if process.poll() is None:
            print("✅ 后端服务启动成功")
            print("🌐 服务地址: http://127.0.0.1:8000")
            return process
        else:
            stdout, stderr = process.communicate()
            print("❌ 后端服务启动失败")
            print(f"错误信息: {stderr}")
            return None
            
    except Exception as e:
        print(f"❌ 启动后端服务时出错: {e}")
        return None

def open_frontend():
    """打开前端界面"""
    print("\n🌐 打开前端界面...")
    
    # 获取高级版文件的绝对路径
    frontend_file = Path("file-manager-advanced.html").absolute()
    
    if not frontend_file.exists():
        print("❌ 前端文件不存在")
        return False
    
    try:
        # 在默认浏览器中打开
        webbrowser.open(f"file://{frontend_file}")
        print("✅ 前端界面已在浏览器中打开")
        print(f"📁 文件路径: {frontend_file}")
        return True
    except Exception as e:
        print(f"❌ 打开前端界面时出错: {e}")
        print(f"请手动在浏览器中打开: {frontend_file}")
        return False

def show_usage_info():
    """显示使用说明"""
    print("\n" + "="*60)
    print("🎉 文件管理系统启动完成！")
    print("="*60)
    
    print("\n📋 使用指南:")
    print("1. 🗂️  浏览文件 - 点击左侧驱动器切换盘符")
    print("2. 📁  进入文件夹 - 双击文件夹名称")
    print("3. ✏️  编辑文件 - 双击可编辑文件（txt、json等）")
    print("4. 🔍  搜索文件 - 在搜索框输入关键词")
    print("5. 📄  新建文件 - 点击工具栏的新建按钮")
    print("6. 💾  保存文件 - 按Ctrl+S或点击保存按钮")
    
    print("\n⌨️  快捷键:")
    print("• Ctrl+S     - 保存文件")
    print("• Ctrl+N     - 新建文件")
    print("• Ctrl+F     - 搜索文件")
    print("• F5         - 刷新列表")
    print("• Delete     - 删除文件")
    print("• F2         - 重命名文件")
    
    print("\n🌐 访问地址:")
    print("• 后端API: http://127.0.0.1:8000")
    print("• 健康检查: http://127.0.0.1:8000/health")
    
    print("\n📚 更多信息:")
    print("• 查看 README.md 了解详细功能")
    print("• 查看 setup_github.md 了解如何发布到GitHub")
    
    print("\n⚠️  停止服务:")
    print("• 按 Ctrl+C 停止后端服务")
    print("• 关闭浏览器标签页")
    
    print("\n" + "="*60)

def main():
    """主函数"""
    print_banner()
    
    # 检查系统要求
    if not check_requirements():
        print("\n❌ 系统要求检查失败，请解决上述问题后重试")
        input("按Enter键退出...")
        return
    
    # 启动后端服务
    backend_process = start_backend()
    if not backend_process:
        print("\n❌ 后端服务启动失败")
        input("按Enter键退出...")
        return
    
    # 打开前端界面
    if not open_frontend():
        print("\n⚠️ 前端界面打开失败，但后端服务正在运行")
    
    # 显示使用说明
    show_usage_info()
    
    try:
        print("\n🔄 服务正在运行中...")
        print("按 Ctrl+C 停止服务")
        
        # 保持服务运行
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\n🛑 正在停止服务...")
        backend_process.terminate()
        backend_process.wait()
        print("✅ 服务已停止")
        print("👋 感谢使用文件管理系统！")

if __name__ == "__main__":
    main()
