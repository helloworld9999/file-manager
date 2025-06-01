/**
 * 文件列表主组件
 */
import React, { useState } from 'react';
import { Button, Space, Radio, Empty, Alert } from 'antd';
import { 
  UnorderedListOutlined, 
  AppstoreOutlined,
  SelectOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import ListView from './ListView';
import GridView from './GridView';
import { 
  DirectoryResponse, 
  SortField, 
  SortOrder, 
  ViewMode, 
  ErrorResponse 
} from '@/types/file';

const FileListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
`;

const FileListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SelectionControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FileListContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 40px;
`;

const ErrorContainer = styled.div`
  padding: 16px;
`;

interface FileListProps {
  directoryData?: DirectoryResponse;
  currentPath: string;
  sortField: SortField;
  sortOrder: SortOrder;
  selectedFiles: string[];
  isLoading: boolean;
  error?: ErrorResponse | null;
  onSort: (field: SortField) => void;
  onFileSelect: (filePath: string, isMultiple?: boolean) => void;
  onFileDoubleClick: (filePath: string, isDirectory: boolean) => void;
  onClearSelection: () => void;
  onToggleSelectAll: () => void;
  isFileSelected: (filePath: string) => boolean;
  isAllSelected: boolean;
}

const FileList: React.FC<FileListProps> = ({
  directoryData,
  currentPath,
  sortField,
  sortOrder,
  selectedFiles,
  isLoading,
  error,
  onSort,
  onFileSelect,
  onFileDoubleClick,
  onClearSelection,
  onToggleSelectAll,
  isFileSelected,
  isAllSelected
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // 处理视图模式切换
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // 渲染错误状态
  if (error) {
    return (
      <FileListContainer>
        <ErrorContainer>
          <Alert
            message="加载失败"
            description={error.message}
            type="error"
            showIcon
          />
        </ErrorContainer>
      </FileListContainer>
    );
  }

  // 渲染空状态
  if (!isLoading && (!directoryData?.items || directoryData.items.length === 0)) {
    return (
      <FileListContainer>
        <FileListHeader>
          <ViewControls>
            <Radio.Group 
              value={viewMode} 
              onChange={(e) => handleViewModeChange(e.target.value)}
              size="small"
            >
              <Radio.Button value="list">
                <UnorderedListOutlined /> 列表
              </Radio.Button>
              <Radio.Button value="grid">
                <AppstoreOutlined /> 网格
              </Radio.Button>
            </Radio.Group>
          </ViewControls>
        </FileListHeader>
        
        <EmptyContainer>
          <Empty 
            description="此文件夹为空"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </EmptyContainer>
      </FileListContainer>
    );
  }

  const hasItems = directoryData?.items && directoryData.items.length > 0;
  const hasSelection = selectedFiles.length > 0;

  return (
    <FileListContainer>
      {/* 文件列表头部 */}
      <FileListHeader>
        <ViewControls>
          <Radio.Group 
            value={viewMode} 
            onChange={(e) => handleViewModeChange(e.target.value)}
            size="small"
          >
            <Radio.Button value="list">
              <UnorderedListOutlined /> 列表
            </Radio.Button>
            <Radio.Button value="grid">
              <AppstoreOutlined /> 网格
            </Radio.Button>
          </Radio.Group>
        </ViewControls>

        {hasItems && (
          <SelectionControls>
            <Button
              size="small"
              icon={<SelectOutlined />}
              onClick={onToggleSelectAll}
            >
              {isAllSelected ? '取消全选' : '全选'}
            </Button>
            
            {hasSelection && (
              <Button
                size="small"
                onClick={onClearSelection}
              >
                清空选择
              </Button>
            )}
          </SelectionControls>
        )}
      </FileListHeader>

      {/* 文件列表内容 */}
      <FileListContent>
        {viewMode === 'list' ? (
          <ListView
            items={directoryData?.items || []}
            sortField={sortField}
            sortOrder={sortOrder}
            selectedFiles={selectedFiles}
            isLoading={isLoading}
            onSort={onSort}
            onFileSelect={onFileSelect}
            onFileDoubleClick={onFileDoubleClick}
            isFileSelected={isFileSelected}
          />
        ) : (
          <GridView
            items={directoryData?.items || []}
            selectedFiles={selectedFiles}
            isLoading={isLoading}
            onFileSelect={onFileSelect}
            onFileDoubleClick={onFileDoubleClick}
            isFileSelected={isFileSelected}
          />
        )}
      </FileListContent>
    </FileListContainer>
  );
};

export default FileList;
