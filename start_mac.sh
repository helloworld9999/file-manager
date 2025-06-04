#!/bin/bash

# File Manager System - macOS Startup Script
# A modern file management and editing system

set -e

# Set terminal title
echo -ne "\033]0;File Manager System\007"

# Clear screen
clear

echo
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🗂️ File Manager System                    ║"
echo "║                                                              ║"
echo "║  A modern file management and editing system                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

echo "🚀 Starting File Manager System..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ Error: Python not found"
        echo "Please install Python 3.7 or higher"
        echo "macOS installation methods:"
        echo "1. Using Homebrew: brew install python3"
        echo "2. Download from: https://www.python.org/downloads/"
        echo "3. Using pyenv: pyenv install 3.11.0"
        echo
        read -p "Press Enter to exit..."
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

echo "✅ Python installed"
$PYTHON_CMD --version

# Check Python version
PYTHON_VERSION=$($PYTHON_CMD -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
REQUIRED_VERSION="3.7"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Error: Python version too low"
    echo "Required Python 3.7 or higher, current version: $PYTHON_VERSION"
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

# Check required files
if [ ! -f "start_backend.py" ]; then
    echo "❌ Error: start_backend.py not found"
    echo "Please make sure you're running this script in the correct directory"
    read -p "Press Enter to exit..."
    exit 1
fi

if [ ! -f "file-manager-advanced.html" ]; then
    echo "❌ Error: file-manager-advanced.html not found"
    echo "Please make sure you're running this script in the correct directory"
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ All required files exist"
echo

echo "🌐 Starting backend service..."
echo "Service URL: http://127.0.0.1:8000"
echo

# Define cleanup function
cleanup() {
    echo
    echo "🛑 Stopping service..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    echo "✅ Service stopped"
    echo "👋 Thank you for using File Manager System!"
    exit 0
}

# Set signal handlers
trap cleanup SIGINT SIGTERM

# Start Python backend service
echo "Starting backend service..."
$PYTHON_CMD quick_start.py &
BACKEND_PID=$!

# Wait for user interruption
echo
echo "🔄 Service is running..."
echo "Press Ctrl+C to stop the service"
echo

# Keep script running
wait $BACKEND_PID
