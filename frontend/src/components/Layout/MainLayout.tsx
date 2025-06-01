/**
 * 主布局组件
 */
import React, { useState } from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import FileList from '../FileList/FileList';
import StatusBar from './StatusBar';
import { useFileList } from '@/hooks/useFileList';
import { useDirectoryTree } from '@/hooks/useDirectoryTree';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;
  background: #f5f5f5;
`;

const StyledContent = styled(Content)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const SidebarArea = styled.div<{ width: number; collapsed: boolean }>`
  width: ${props => props.collapsed ? 0 : props.width}px;
  min-width: ${props => props.collapsed ? 0 : 200}px;
  max-width: 500px;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-left: 1px solid #f0f0f0;
  min-width: 0;
`;

const MainLayout: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 使用文件列表Hook
  const fileListHook = useFileList({
    initialPath: 'C:\\'
  });

  // 使用目录树Hook
  const directoryTreeHook = useDirectoryTree(fileListHook.currentPath);

  // 处理目录选择
  const handleDirectorySelect = (path: string) => {
    fileListHook.navigateToPath(path);
  };

  // 处理文件双击
  const handleFileDoubleClick = (filePath: string, isDirectory: boolean) => {
    if (isDirectory) {
      fileListHook.navigateToPath(filePath);
    } else {
      // TODO: 打开文件编辑器
      console.log('打开文件:', filePath);
    }
  };

  // 处理侧边栏折叠
  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <StyledLayout>
      <StyledContent>
        {/* 工具栏 */}
        <Toolbar
          currentPath={fileListHook.currentPath}
          onNavigateToParent={fileListHook.navigateToParent}
          onRefresh={fileListHook.refreshDirectory}
          onNavigateToPath={fileListHook.navigateToPath}
          canGoBack={!!fileListHook.directoryData?.parent_path}
          isLoading={fileListHook.isLoading}
        />

        {/* 主内容区域 */}
        <MainContent>
          {/* 侧边栏 */}
          <SidebarArea width={sidebarWidth} collapsed={sidebarCollapsed}>
            <Sidebar
              treeData={directoryTreeHook.treeData}
              drives={directoryTreeHook.drives}
              expandedNodes={directoryTreeHook.expandedNodes}
              currentPath={fileListHook.currentPath}
              isLoading={directoryTreeHook.isLoading}
              onDirectorySelect={handleDirectorySelect}
              onToggleExpansion={directoryTreeHook.toggleNodeExpansion}
              onExpandToPath={directoryTreeHook.expandToPath}
              formatDriveName={directoryTreeHook.formatDriveName}
              collapsed={sidebarCollapsed}
              onCollapse={handleSidebarCollapse}
            />
          </SidebarArea>

          {/* 文件列表区域 */}
          <ContentArea>
            <FileList
              directoryData={fileListHook.directoryData}
              currentPath={fileListHook.currentPath}
              sortField={fileListHook.sortField}
              sortOrder={fileListHook.sortOrder}
              selectedFiles={fileListHook.selectedFiles}
              isLoading={fileListHook.isLoading}
              error={fileListHook.error}
              onSort={fileListHook.handleSort}
              onFileSelect={fileListHook.handleFileSelect}
              onFileDoubleClick={handleFileDoubleClick}
              onClearSelection={fileListHook.clearSelection}
              onToggleSelectAll={fileListHook.toggleSelectAll}
              isFileSelected={fileListHook.isFileSelected}
              isAllSelected={fileListHook.isAllSelected}
            />
          </ContentArea>
        </MainContent>

        {/* 状态栏 */}
        <StatusBar
          directoryData={fileListHook.directoryData}
          selectedCount={fileListHook.selectedCount}
          isLoading={fileListHook.isLoading}
          error={fileListHook.error}
        />
      </StyledContent>
    </StyledLayout>
  );
};

export default MainLayout;
