/**
 * 侧边栏组件
 */
import React from 'react';
import { Tree, Spin, Typography, Space, Progress } from 'antd';
import {
  FolderOutlined,
  FolderOpenOutlined,
  HddOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { DirectoryTreeNode, SystemDrive } from '@/types/file';

const { Title } = Typography;

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  height: 100%;
  background: #fafafa;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  width: ${props => props.collapsed ? '0' : '100%'};
  overflow: hidden;
  transition: width 0.3s ease;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const SectionTitle = styled(Title)`
  &.ant-typography {
    margin-bottom: 12px !important;
    font-size: 14px !important;
    color: #666 !important;
    font-weight: 600 !important;
  }
`;

const DriveItem = styled.div`
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    background: #e6f7ff;
    border-color: #91d5ff;
  }
  
  &.active {
    background: #1890ff;
    color: white;
    
    .ant-progress-text {
      color: white !important;
    }
  }
`;

const DriveInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const DriveStats = styled.div`
  font-size: 12px;
  color: #666;
  margin-left: 24px;
`;

const TreeContainer = styled.div`
  margin-top: 16px;
  
  .ant-tree {
    background: transparent;
    
    .ant-tree-node-content-wrapper {
      border-radius: 4px;
      transition: all 0.2s ease;
      
      &:hover {
        background: #e6f7ff;
      }
      
      &.ant-tree-node-selected {
        background: #1890ff !important;
        color: white;
      }
    }
    
    .ant-tree-title {
      font-size: 13px;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

interface SidebarProps {
  treeData: DirectoryTreeNode | null;
  drives: SystemDrive[] | undefined;
  expandedNodes: string[];
  currentPath: string;
  isLoading: boolean;
  onDirectorySelect: (path: string) => void;
  onToggleExpansion: (path: string) => void;
  onExpandToPath: (path: string) => void;
  formatDriveName: (drive: SystemDrive) => string;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  treeData,
  drives,
  expandedNodes,
  currentPath,
  isLoading,
  onDirectorySelect,
  onToggleExpansion,
  onExpandToPath,
  formatDriveName,
  collapsed
}) => {

  // 构建树节点数据
  const buildTreeData = (node: DirectoryTreeNode): any => {
    return {
      title: node.name,
      key: node.path,
      icon: node.children.length > 0 ? <FolderOutlined /> : <FolderOutlined />,
      children: node.children.map(child => buildTreeData(child))
    };
  };

  // 处理树节点选择
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const selectedPath = selectedKeys[0] as string;
      onDirectorySelect(selectedPath);
    }
  };

  // 处理树节点展开
  const handleTreeExpand = (expandedKeys: React.Key[]) => {
    // 找出新展开或收起的节点
    const currentExpandedSet = new Set(expandedNodes);
    const newExpandedSet = new Set(expandedKeys as string[]);
    
    // 找出变化的节点
    for (const key of expandedKeys as string[]) {
      if (!currentExpandedSet.has(key)) {
        onToggleExpansion(key);
      }
    }
    
    for (const key of expandedNodes) {
      if (!newExpandedSet.has(key)) {
        onToggleExpansion(key);
      }
    }
  };

  // 处理驱动器点击
  const handleDriveClick = (drive: SystemDrive) => {
    const drivePath = `${drive.letter}:\\`;
    onDirectorySelect(drivePath);
    onExpandToPath(drivePath);
  };

  // 计算驱动器使用率
  const getDriveUsagePercent = (drive: SystemDrive) => {
    const used = drive.total_space - drive.free_space;
    return Math.round((used / drive.total_space) * 100);
  };

  // 格式化存储大小
  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  if (collapsed) {
    return <SidebarContainer collapsed={true} />;
  }

  return (
    <SidebarContainer collapsed={false}>
      <SidebarContent>
        {/* 驱动器列表 */}
        <div>
          <SectionTitle level={5}>
            <HddOutlined /> 此电脑
          </SectionTitle>
          
          {isLoading && !drives ? (
            <LoadingContainer>
              <Spin indicator={<LoadingOutlined spin />} />
            </LoadingContainer>
          ) : (
            drives?.map(drive => {
              const isActive = currentPath.startsWith(`${drive.letter}:\\`);
              const usagePercent = getDriveUsagePercent(drive);
              
              return (
                <DriveItem
                  key={drive.letter}
                  className={isActive ? 'active' : ''}
                  onClick={() => handleDriveClick(drive)}
                >
                  <DriveInfo>
                    <HddOutlined />
                    <span>{drive.label || `本地磁盘 (${drive.letter}:)`}</span>
                  </DriveInfo>
                  <DriveStats>
                    <div style={{ marginBottom: 4 }}>
                      {formatBytes(drive.free_space)} 可用，共 {formatBytes(drive.total_space)}
                    </div>
                    <Progress
                      percent={usagePercent}
                      size="small"
                      strokeColor={usagePercent > 90 ? '#ff4d4f' : usagePercent > 70 ? '#faad14' : '#52c41a'}
                      showInfo={false}
                    />
                  </DriveStats>
                </DriveItem>
              );
            })
          )}
        </div>

        {/* 目录树 */}
        {treeData && (
          <TreeContainer>
            <SectionTitle level={5}>
              <FolderOutlined /> 文件夹
            </SectionTitle>
            
            <Tree
              treeData={[buildTreeData(treeData)]}
              expandedKeys={expandedNodes}
              selectedKeys={[currentPath]}
              onSelect={handleTreeSelect}
              onExpand={handleTreeExpand}
              showIcon
              blockNode
            />
          </TreeContainer>
        )}
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
