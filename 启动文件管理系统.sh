#!/bin/bash

# 设置脚本在出错时退出
set -e

# 设置UTF-8编码
export LANG=zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8

# 设置终端标题
echo -ne "\033]0;文件管理系统 - File Manager System\007"

# 清屏
clear

echo
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🗂️ 文件管理系统                           ║"
echo "║                  File Manager System                        ║"
echo "║                                                              ║"
echo "║  一个现代化的文件管理和编辑系统                                ║"
echo "║  A modern file management and editing system                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

echo "🚀 正在启动文件管理系统..."
echo

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ 错误: 未找到Python"
        echo "请先安装Python 3.7或更高版本"
        echo "macOS安装方法:"
        echo "1. 使用Homebrew: brew install python3"
        echo "2. 从官网下载: https://www.python.org/downloads/"
        echo "3. 使用pyenv: pyenv install 3.11.0"
        echo
        read -p "按Enter键退出..."
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

echo "✅ Python已安装"
$PYTHON_CMD --version

# 检查Python版本
PYTHON_VERSION=$($PYTHON_CMD -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
REQUIRED_VERSION="3.7"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ 错误: Python版本过低"
    echo "需要Python 3.7或更高版本，当前版本: $PYTHON_VERSION"
    echo
    read -p "按Enter键退出..."
    exit 1
fi

# 检查必要文件
if [ ! -f "start_backend.py" ]; then
    echo "❌ 错误: 未找到 start_backend.py"
    echo "请确保在正确的目录中运行此脚本"
    read -p "按Enter键退出..."
    exit 1
fi

if [ ! -f "file-manager-advanced.html" ]; then
    echo "❌ 错误: 未找到 file-manager-advanced.html"
    echo "请确保在正确的目录中运行此脚本"
    read -p "按Enter键退出..."
    exit 1
fi

echo "✅ 所有必要文件存在"
echo

echo "🌐 启动后端服务..."
echo "服务地址: http://127.0.0.1:8000"
echo

# 定义清理函数
cleanup() {
    echo
    echo "🛑 正在停止服务..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    echo "✅ 服务已停止"
    echo "👋 感谢使用文件管理系统！"
    exit 0
}

# 设置信号处理
trap cleanup SIGINT SIGTERM

# 启动Python后端服务
echo "正在启动后端服务..."
$PYTHON_CMD quick_start.py &
BACKEND_PID=$!

# 等待用户中断
echo
echo "🔄 服务正在运行中..."
echo "按 Ctrl+C 停止服务"
echo

# 保持脚本运行
wait $BACKEND_PID
