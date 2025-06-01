/**
 * 目录树相关的React Hook
 */
import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { FileService } from '@/services/fileService';
import { DirectoryTreeNode, SystemDrive, ErrorResponse } from '@/types/file';

export const useDirectoryTree = (initialPath: string = 'C:\\') => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([initialPath]));

  // 获取系统驱动器
  const {
    data: drives,
    isLoading: drivesLoading,
    error: drivesError
  } = useQuery<SystemDrive[], ErrorResponse>(
    'systemDrives',
    FileService.getSystemDrives,
    {
      retry: 2,
      staleTime: 60000, // 1分钟内数据被认为是新鲜的
      cacheTime: 300000, // 5分钟缓存时间
    }
  );

  // 获取目录树
  const {
    data: treeData,
    isLoading: treeLoading,
    error: treeError,
    refetch: refetchTree
  } = useQuery<DirectoryTreeNode, ErrorResponse>(
    ['directoryTree', initialPath],
    () => FileService.getDirectoryTree(initialPath, 2),
    {
      retry: 2,
      staleTime: 60000,
      cacheTime: 300000,
      enabled: !!initialPath, // 只有当路径存在时才执行查询
    }
  );

  // 切换节点展开/收起状态
  const toggleNodeExpansion = useCallback((nodePath: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });
  }, []);

  // 展开节点
  const expandNode = useCallback((nodePath: string) => {
    setExpandedNodes(prev => new Set(prev).add(nodePath));
  }, []);

  // 收起节点
  const collapseNode = useCallback((nodePath: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodePath);
      return newSet;
    });
  }, []);

  // 检查节点是否展开
  const isNodeExpanded = useCallback((nodePath: string) => {
    return expandedNodes.has(nodePath);
  }, [expandedNodes]);

  // 展开到指定路径（展开路径上的所有父节点）
  const expandToPath = useCallback((targetPath: string) => {
    const pathParts = targetPath.split('\\').filter(Boolean);
    const pathsToExpand: string[] = [];
    
    let currentPath = '';
    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}\\${part}` : `${part}\\`;
      pathsToExpand.push(currentPath);
    }
    
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      pathsToExpand.forEach(path => newSet.add(path));
      return newSet;
    });
  }, []);

  // 收起所有节点
  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  // 展开所有一级节点
  const expandFirstLevel = useCallback(() => {
    if (treeData?.children) {
      const firstLevelPaths = treeData.children.map(child => child.path);
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        firstLevelPaths.forEach(path => newSet.add(path));
        return newSet;
      });
    }
  }, [treeData]);

  // 格式化驱动器显示名称
  const formatDriveName = useCallback((drive: SystemDrive) => {
    const usedSpace = drive.total_space - drive.free_space;
    const usagePercent = Math.round((usedSpace / drive.total_space) * 100);
    const totalGB = Math.round(drive.total_space / (1024 * 1024 * 1024));
    
    let displayName = `${drive.letter}:\\`;
    if (drive.label) {
      displayName += ` (${drive.label})`;
    }
    displayName += ` - ${totalGB}GB (${usagePercent}% 已用)`;
    
    return displayName;
  }, []);

  // 递归渲染树节点的辅助函数
  const renderTreeNode = useCallback((node: DirectoryTreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = isNodeExpanded(node.path);
    
    return {
      ...node,
      level,
      hasChildren,
      isExpanded,
      children: isExpanded && hasChildren 
        ? node.children.map(child => renderTreeNode(child, level + 1))
        : []
    };
  }, [isNodeExpanded]);

  return {
    // 数据
    drives,
    treeData: treeData ? renderTreeNode(treeData) : null,
    expandedNodes: Array.from(expandedNodes),
    
    // 状态
    isLoading: drivesLoading || treeLoading,
    error: drivesError || treeError,
    
    // 操作方法
    toggleNodeExpansion,
    expandNode,
    collapseNode,
    isNodeExpanded,
    expandToPath,
    collapseAll,
    expandFirstLevel,
    formatDriveName,
    refetchTree,
  };
};
