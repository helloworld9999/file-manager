#!/bin/bash

# File Manager System Launcher for macOS
# Simple launcher script that detects the system and runs the appropriate startup script

echo "🚀 File Manager System Launcher"
echo "================================"
echo

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "✅ Detected macOS system"
    echo
    
    # Check if startup scripts exist
    if [ -f "start_mac.sh" ]; then
        echo "🎯 Using English startup script..."
        ./start_mac.sh
    elif [ -f "启动文件管理系统.sh" ]; then
        echo "🎯 Using Chinese startup script..."
        ./启动文件管理系统.sh
    elif [ -f "quick_start.py" ]; then
        echo "🎯 Using Python startup script..."
        python3 quick_start.py
    else
        echo "❌ Error: No startup script found"
        echo "Please make sure you're in the correct directory"
        exit 1
    fi
else
    echo "⚠️  This launcher is designed for macOS"
    echo "For other systems, please use the appropriate startup script:"
    echo "- Windows: 启动文件管理系统.bat"
    echo "- Linux: python3 quick_start.py"
    echo "- macOS: ./start_mac.sh or ./启动文件管理系统.sh"
    exit 1
fi
