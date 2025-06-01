/**
 * 文件列表相关的React Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { FileService } from '@/services/fileService';
import { DirectoryResponse, SortField, SortOrder, ErrorResponse } from '@/types/file';

interface UseFileListOptions {
  initialPath?: string;
  initialSortField?: SortField;
  initialSortOrder?: SortOrder;
}

export const useFileList = (options: UseFileListOptions = {}) => {
  const {
    initialPath = 'C:\\',
    initialSortField = 'name',
    initialSortOrder = 'asc'
  } = options;

  const [currentPath, setCurrentPath] = useState(initialPath);
  const [sortField, setSortField] = useState<SortField>(initialSortField);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // 使用React Query获取文件列表
  const {
    data: directoryData,
    isLoading,
    error,
    refetch
  } = useQuery<DirectoryResponse, ErrorResponse>(
    ['fileList', currentPath, sortField, sortOrder],
    () => FileService.listFiles(currentPath, sortField, sortOrder),
    {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30秒内数据被认为是新鲜的
      cacheTime: 300000, // 5分钟缓存时间
      onError: (error) => {
        console.error('获取文件列表失败:', error);
      }
    }
  );

  // 导航到指定路径
  const navigateToPath = useCallback((path: string) => {
    setCurrentPath(path);
    setSelectedFiles([]); // 清空选中的文件
  }, []);

  // 导航到父目录
  const navigateToParent = useCallback(() => {
    if (directoryData?.parent_path) {
      navigateToPath(directoryData.parent_path);
    }
  }, [directoryData?.parent_path, navigateToPath]);

  // 刷新当前目录
  const refreshDirectory = useCallback(() => {
    refetch();
    // 清除相关缓存
    queryClient.invalidateQueries(['fileList', currentPath]);
  }, [refetch, queryClient, currentPath]);

  // 排序处理
  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      // 如果点击的是当前排序字段，切换排序顺序
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 如果点击的是新字段，设置为升序
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  // 文件选择处理
  const handleFileSelect = useCallback((filePath: string, isMultiple: boolean = false) => {
    if (isMultiple) {
      setSelectedFiles(prev => {
        if (prev.includes(filePath)) {
          return prev.filter(path => path !== filePath);
        } else {
          return [...prev, filePath];
        }
      });
    } else {
      setSelectedFiles([filePath]);
    }
  }, []);

  // 清空选择
  const clearSelection = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  // 全选/取消全选
  const toggleSelectAll = useCallback(() => {
    if (!directoryData?.items) return;

    const allFilePaths = directoryData.items.map(item => item.path);
    if (selectedFiles.length === allFilePaths.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(allFilePaths);
    }
  }, [directoryData?.items, selectedFiles.length]);

  // 检查文件是否被选中
  const isFileSelected = useCallback((filePath: string) => {
    return selectedFiles.includes(filePath);
  }, [selectedFiles]);

  // 获取选中文件的数量
  const selectedCount = selectedFiles.length;

  // 检查是否全选
  const isAllSelected = directoryData?.items 
    ? selectedFiles.length === directoryData.items.length && directoryData.items.length > 0
    : false;

  return {
    // 数据
    directoryData,
    currentPath,
    sortField,
    sortOrder,
    selectedFiles,
    selectedCount,
    isAllSelected,
    
    // 状态
    isLoading,
    error,
    
    // 操作方法
    navigateToPath,
    navigateToParent,
    refreshDirectory,
    handleSort,
    handleFileSelect,
    clearSelection,
    toggleSelectAll,
    isFileSelected,
  };
};
