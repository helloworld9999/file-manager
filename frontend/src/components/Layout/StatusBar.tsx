/**
 * 状态栏组件
 */
import React from 'react';
import { Space, Typography, Spin } from 'antd';
import { LoadingOutlined, FileOutlined, FolderOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { DirectoryResponse, ErrorResponse } from '@/types/file';
import { FileService } from '@/services/fileService';

const { Text } = Typography;

const StatusBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  background: #f5f5f5;
  border-top: 1px solid #d9d9d9;
  font-size: 12px;
  color: #666;
  min-height: 28px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ErrorText = styled(Text)`
  color: #ff4d4f !important;
`;

const LoadingText = styled(Text)`
  color: #1890ff !important;
`;

interface StatusBarProps {
  directoryData?: DirectoryResponse;
  selectedCount: number;
  isLoading: boolean;
  error?: ErrorResponse | null;
}

const StatusBar: React.FC<StatusBarProps> = ({
  directoryData,
  selectedCount,
  isLoading,
  error
}) => {
  
  // 计算文件和文件夹数量
  const getItemCounts = () => {
    if (!directoryData?.items) {
      return { folders: 0, files: 0 };
    }
    
    const folders = directoryData.items.filter(item => item.is_directory).length;
    const files = directoryData.items.filter(item => !item.is_directory).length;
    
    return { folders, files };
  };

  // 格式化总大小
  const formatTotalSize = () => {
    if (!directoryData) return '0 B';
    return FileService.formatFileSize(directoryData.total_size);
  };

  // 格式化选中信息
  const getSelectionInfo = () => {
    if (selectedCount === 0) return null;
    if (selectedCount === 1) return '已选中 1 项';
    return `已选中 ${selectedCount} 项`;
  };

  const { folders, files } = getItemCounts();

  return (
    <StatusBarContainer>
      <LeftSection>
        {/* 加载状态 */}
        {isLoading && (
          <StatusItem>
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 12 }} spin />} 
              size="small" 
            />
            <LoadingText>加载中...</LoadingText>
          </StatusItem>
        )}

        {/* 错误信息 */}
        {error && !isLoading && (
          <StatusItem>
            <ErrorText>错误: {error.message}</ErrorText>
          </StatusItem>
        )}

        {/* 文件统计 */}
        {!error && directoryData && (
          <Space size={16}>
            {folders > 0 && (
              <StatusItem>
                <FolderOutlined />
                <Text>{folders} 个文件夹</Text>
              </StatusItem>
            )}
            
            {files > 0 && (
              <StatusItem>
                <FileOutlined />
                <Text>{files} 个文件</Text>
              </StatusItem>
            )}
            
            {files === 0 && folders === 0 && (
              <StatusItem>
                <Text>空文件夹</Text>
              </StatusItem>
            )}
          </Space>
        )}
      </LeftSection>

      <RightSection>
        {/* 选中项信息 */}
        {selectedCount > 0 && (
          <StatusItem>
            <Text strong>{getSelectionInfo()}</Text>
          </StatusItem>
        )}

        {/* 总大小 */}
        {!error && directoryData && directoryData.total_size > 0 && (
          <StatusItem>
            <Text>总大小: {formatTotalSize()}</Text>
          </StatusItem>
        )}

        {/* 当前路径 */}
        {directoryData && (
          <StatusItem>
            <Text type="secondary">{directoryData.current_path}</Text>
          </StatusItem>
        )}
      </RightSection>
    </StatusBarContainer>
  );
};

export default StatusBar;
