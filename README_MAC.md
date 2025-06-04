# macOS 启动指南 / macOS Startup Guide

## 中文版

### 系统要求
- macOS 10.12 或更高版本
- Python 3.7 或更高版本

### 安装 Python（如果尚未安装）

#### 方法1：使用 Homebrew（推荐）
```bash
# 安装 Homebrew（如果尚未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Python
brew install python3
```

#### 方法2：从官网下载
访问 [Python官网](https://www.python.org/downloads/) 下载并安装最新版本

#### 方法3：使用 pyenv
```bash
# 安装 pyenv
brew install pyenv

# 安装 Python
pyenv install 3.11.0
pyenv global 3.11.0
```

### 启动方法

#### 方法1：使用中文启动脚本
```bash
# 在终端中进入项目目录
cd /path/to/file-manager

# 运行启动脚本
./启动文件管理系统.sh
```

#### 方法2：使用英文启动脚本
```bash
# 在终端中进入项目目录
cd /path/to/file-manager

# 运行启动脚本
./start_mac.sh
```

#### 方法3：直接运行Python脚本
```bash
# 在终端中进入项目目录
cd /path/to/file-manager

# 直接运行Python启动脚本
python3 quick_start.py
```

### 使用说明
1. 运行启动脚本后，系统会自动：
   - 检查Python环境
   - 验证必要文件
   - 启动后端服务
   - 在浏览器中打开文件管理界面

2. 服务地址：http://127.0.0.1:8000

3. 停止服务：按 `Ctrl+C`

### 故障排除

#### 权限问题
如果遇到权限错误，请运行：
```bash
chmod +x 启动文件管理系统.sh
chmod +x start_mac.sh
```

#### Python版本问题
确保使用Python 3.7或更高版本：
```bash
python3 --version
```

---

## English Version

### System Requirements
- macOS 10.12 or higher
- Python 3.7 or higher

### Install Python (if not already installed)

#### Method 1: Using Homebrew (Recommended)
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python3
```

#### Method 2: Download from Official Website
Visit [Python Official Website](https://www.python.org/downloads/) to download and install the latest version

#### Method 3: Using pyenv
```bash
# Install pyenv
brew install pyenv

# Install Python
pyenv install 3.11.0
pyenv global 3.11.0
```

### How to Start

#### Method 1: Using Chinese Startup Script
```bash
# Navigate to project directory in terminal
cd /path/to/file-manager

# Run startup script
./启动文件管理系统.sh
```

#### Method 2: Using English Startup Script
```bash
# Navigate to project directory in terminal
cd /path/to/file-manager

# Run startup script
./start_mac.sh
```

#### Method 3: Run Python Script Directly
```bash
# Navigate to project directory in terminal
cd /path/to/file-manager

# Run Python startup script directly
python3 quick_start.py
```

### Usage Instructions
1. After running the startup script, the system will automatically:
   - Check Python environment
   - Verify required files
   - Start backend service
   - Open file manager interface in browser

2. Service URL: http://127.0.0.1:8000

3. Stop service: Press `Ctrl+C`

### Troubleshooting

#### Permission Issues
If you encounter permission errors, run:
```bash
chmod +x 启动文件管理系统.sh
chmod +x start_mac.sh
```

#### Python Version Issues
Make sure you're using Python 3.7 or higher:
```bash
python3 --version
```
