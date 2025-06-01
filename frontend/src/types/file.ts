/**
 * 文件系统相关类型定义
 */

export interface FileItem {
  name: string;
  path: string;
  size: number;
  modified_time: string;
  is_directory: boolean;
  file_type: string;
  extension?: string;
  permissions: string;
}

export interface DirectoryResponse {
  current_path: string;
  parent_path?: string;
  items: FileItem[];
  total_count: number;
  total_size: number;
}

export interface DirectoryTreeNode {
  name: string;
  path: string;
  children: DirectoryTreeNode[];
  is_expanded: boolean;
}

export interface SystemDrive {
  letter: string;
  label?: string;
  total_space: number;
  free_space: number;
  drive_type: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: string;
}

// 视图模式
export type ViewMode = 'list' | 'grid';

// 排序字段
export type SortField = 'name' | 'size' | 'modified_time' | 'type';

// 排序顺序
export type SortOrder = 'asc' | 'desc';

// 文件操作类型
export type FileOperation = 'copy' | 'move' | 'delete' | 'rename';

// 应用状态
export interface AppState {
  currentPath: string;
  viewMode: ViewMode;
  sortField: SortField;
  sortOrder: SortOrder;
  selectedFiles: string[];
  isLoading: boolean;
  error?: string;
}

// API响应包装
export interface ApiResponse<T> {
  data?: T;
  error?: ErrorResponse;
  loading: boolean;
}
