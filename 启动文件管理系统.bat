@echo off
chcp 65001 >nul
title 文件管理系统 - File Manager System

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🗂️ 文件管理系统                           ║
echo ║                  File Manager System                        ║
echo ║                                                              ║
echo ║  一个现代化的文件管理和编辑系统                                ║
echo ║  A modern file management and editing system                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 正在启动文件管理系统...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Python
    echo 请先安装Python 3.7或更高版本
    echo 下载地址: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo ✅ Python已安装
python --version

REM 检查必要文件
if not exist "start_backend.py" (
    echo ❌ 错误: 未找到 start_backend.py
    echo 请确保在正确的目录中运行此脚本
    pause
    exit /b 1
)

if not exist "file-manager-advanced.html" (
    echo ❌ 错误: 未找到 file-manager-advanced.html
    echo 请确保在正确的目录中运行此脚本
    pause
    exit /b 1
)

echo ✅ 所有必要文件存在
echo.

echo 🌐 启动后端服务...
echo 服务地址: http://127.0.0.1:8000
echo.

REM 启动Python后端服务
python quick_start.py

echo.
echo 👋 感谢使用文件管理系统！
pause
