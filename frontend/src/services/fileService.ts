/**
 * 文件管理相关API服务
 */
import { api } from './api';
import {
  DirectoryResponse,
  DirectoryTreeNode,
  FileItem,
  SystemDrive,
  SortField,
  SortOrder
} from '@/types/file';

export class FileService {
  /**
   * 获取目录文件列表
   */
  static async listFiles(
    path: string,
    sortBy: SortField = 'name',
    sortOrder: SortOrder = 'asc'
  ): Promise<DirectoryResponse> {
    return api.get<DirectoryResponse>('/api/files/list', {
      path,
      sort_by: sortBy,
      sort_order: sortOrder
    });
  }

  /**
   * 获取目录树结构
   */
  static async getDirectoryTree(
    path: string,
    maxDepth: number = 3
  ): Promise<DirectoryTreeNode> {
    return api.get<DirectoryTreeNode>('/api/files/tree', {
      path,
      max_depth: maxDepth
    });
  }

  /**
   * 获取文件详细信息
   */
  static async getFileInfo(path: string): Promise<FileItem> {
    return api.get<FileItem>('/api/files/info', { path });
  }

  /**
   * 获取系统驱动器列表
   */
  static async getSystemDrives(): Promise<SystemDrive[]> {
    return api.get<SystemDrive[]>('/api/files/drives');
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 格式化修改时间
   */
  static formatModifiedTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '今天 ' + date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return '昨天 ' + date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  }

  /**
   * 获取文件类型图标
   */
  static getFileIcon(fileItem: FileItem): string {
    if (fileItem.is_directory) {
      return '📁';
    }

    switch (fileItem.file_type) {
      case 'text':
        return '📄';
      case 'code':
        return '⚙️';
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      case 'audio':
        return '🎵';
      case 'document':
        return '📋';
      case 'archive':
        return '📦';
      default:
        return '📄';
    }
  }

  /**
   * 获取文件类型颜色
   */
  static getFileTypeColor(fileItem: FileItem): string {
    if (fileItem.is_directory) {
      return '#1890ff';
    }

    switch (fileItem.file_type) {
      case 'text':
        return '#666666';
      case 'code':
        return '#fa8c16';
      case 'image':
        return '#52c41a';
      case 'video':
        return '#722ed1';
      case 'audio':
        return '#eb2f96';
      case 'document':
        return '#1890ff';
      case 'archive':
        return '#faad14';
      default:
        return '#8c8c8c';
    }
  }

  /**
   * 检查是否为可编辑的文本文件
   */
  static isEditableFile(fileItem: FileItem): boolean {
    if (fileItem.is_directory) return false;
    
    const editableExtensions = ['.txt', '.json', '.md', '.xml', '.yaml', '.yml', '.log'];
    return editableExtensions.includes(fileItem.extension?.toLowerCase() || '');
  }
}
