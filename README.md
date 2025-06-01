# 🗂️ 文件管理系统

![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/file-manager-system?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/file-manager-system?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/file-manager-system?style=flat-square)
![GitHub license](https://img.shields.io/github/license/YOUR_USERNAME/file-manager-system?style=flat-square)
![Python version](https://img.shields.io/badge/python-3.7+-blue?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=flat-square)

一个现代化的文件管理和编辑系统，具有美观的界面和完整的文件操作功能。

## 🌟 在线演示

- [基础版演示](https://your-username.github.io/file-manager-system/file-manager-demo.html)
- [编辑器版演示](https://your-username.github.io/file-manager-system/file-manager-editor.html)
- [高级版演示](https://your-username.github.io/file-manager-system/file-manager-advanced.html) ⭐ 推荐

## ✨ 功能特性

### 📁 文件管理
- **文件浏览** - 支持所有驱动器和文件夹浏览
- **文件搜索** - 实时搜索文件，支持关键词高亮
- **文件操作** - 新建、删除、重命名文件和文件夹
- **导航功能** - 面包屑导航、前进后退、快速跳转

### ✏️ 文件编辑
- **文本编辑** - 支持 .txt, .md, .log 等文本文件
- **代码编辑** - 支持 .json, .xml, .yaml, .yml 等代码文件
- **配置编辑** - 支持 .ini, .cfg, .conf 等配置文件
- **JSON格式化** - 一键格式化JSON文件
- **实时保存** - 自动检测文件更改，支持快速保存

### 🎨 用户界面
- **现代化设计** - 渐变色标题栏，美观的界面布局
- **分屏布局** - 左侧文件列表，右侧编辑器
- **响应式交互** - 悬停效果、选中状态、加载动画
- **通知系统** - 实时显示操作结果
- **状态栏** - 显示文件统计和当前路径

### ⌨️ 快捷键支持
- **Ctrl+S** - 保存当前文件
- **Ctrl+N** - 新建文件
- **Ctrl+Shift+N** - 新建文件夹
- **Ctrl+W** - 关闭编辑器
- **Ctrl+F** - 搜索文件
- **F5** - 刷新文件列表
- **Ctrl+Shift+F** - 格式化JSON文件
- **Delete** - 删除选中文件
- **F2** - 重命名文件

## 🔧 技术架构

### 后端 (Python)
- **HTTP服务器** - 基于Python内置http.server
- **RESTful API** - 完整的文件操作API接口
- **跨域支持** - 完整的CORS配置
- **错误处理** - 完善的错误处理和日志记录

### 前端 (HTML/CSS/JavaScript)
- **现代化界面** - 使用CSS3和HTML5
- **响应式设计** - 自适应不同屏幕尺寸
- **异步操作** - 使用Fetch API进行数据交互
- **事件驱动** - 完整的用户交互处理

## 📋 文件结构

```
文件管理系统/
├── start_backend.py              # 后端服务器
├── file-manager-demo.html        # 基础演示版
├── file-manager-editor.html      # 带编辑器版
├── file-manager-advanced.html    # 高级完整版（推荐）
├── test-file.txt                 # 测试文本文件
├── test-config.json              # 测试JSON文件
└── README.md                     # 使用说明
```

## 🚀 快速开始

### 1. 启动后端服务
```bash
python start_backend.py
```

### 2. 打开前端界面
在浏览器中打开以下任一文件：
- `file-manager-demo.html` - 基础版
- `file-manager-editor.html` - 带编辑器版
- `file-manager-advanced.html` - 高级版（推荐）

### 3. 开始使用
1. 点击左侧驱动器切换盘符
2. 双击文件夹进入子目录
3. 双击可编辑文件在右侧编辑器中打开
4. 使用工具栏按钮或快捷键进行操作

## 📖 API接口

### 文件列表
```
GET /api/files/list?path=C:/
```

### 文件内容
```
GET /api/files/content?path=C:/test.txt
```

### 保存文件
```
POST /api/files/save
{
  "path": "C:/test.txt",
  "content": "文件内容",
  "encoding": "utf-8"
}
```

### 删除文件
```
DELETE /api/files/delete?path=C:/test.txt
```

### 创建文件夹
```
POST /api/files/mkdir
{
  "path": "C:/新文件夹"
}
```

### 系统驱动器
```
GET /api/files/drives
```

## 🎯 使用技巧

### 文件编辑
1. 双击文件名或点击"编辑"按钮打开文件
2. 在右侧编辑器中修改内容
3. 按Ctrl+S或点击保存按钮保存
4. 文件名后的 * 表示有未保存的更改

### JSON文件
1. 打开JSON文件会自动应用深色主题
2. 点击"🎨 格式化"按钮或按Ctrl+Shift+F格式化
3. 保存时会自动验证JSON语法

### 搜索文件
1. 在搜索框中输入关键词
2. 匹配的文件会高亮显示
3. 按Ctrl+F快速聚焦搜索框

## 📝 更新日志

### v3.0 (高级版) - 已完成 ✅
- ✅ 添加搜索功能
- ✅ 完整的键盘快捷键支持
- ✅ JSON格式化功能
- ✅ 文件删除和重命名
- ✅ 新建文件夹功能

### v2.0 (编辑器版) - 已完成 ✅
- ✅ 文件编辑功能
- ✅ 分屏布局
- ✅ 实时保存
- ✅ 多格式支持

### v1.0 (基础版) - 已完成 ✅
- ✅ 文件浏览
- ✅ 驱动器切换
- ✅ 基础导航

---

**文件管理系统** - 让文件管理变得简单高效！ 🚀
