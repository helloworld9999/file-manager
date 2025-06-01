/**
 * 网格视图组件
 */
import React from 'react';
import { Card, Typography, Checkbox, Spin } from 'antd';
import { FolderOutlined, FileOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { FileItem } from '@/types/file';
import { FileService } from '@/services/fileService';

const { Text } = Typography;

const GridContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 16px;
`;

const GridContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  padding-bottom: 20px;
`;

const FileCard = styled(Card)<{ selected: boolean }>`
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.selected ? '#1890ff' : 'transparent'};
  background: ${props => props.selected ? '#e6f7ff' : '#ffffff'};
  
  &:hover {
    border-color: ${props => props.selected ? '#1890ff' : '#d9d9d9'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .ant-card-body {
    padding: 12px;
    text-align: center;
  }
`;

const FileIconContainer = styled.div<{ color: string }>`
  font-size: 48px;
  color: ${props => props.color};
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
`;

const FileName = styled.div`
  font-size: 12px;
  line-height: 1.4;
  word-break: break-all;
  margin-bottom: 4px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileInfo = styled.div`
  font-size: 11px;
  color: #666;
  margin-top: 4px;
`;

const CheckboxContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

interface GridViewProps {
  items: FileItem[];
  selectedFiles: string[];
  isLoading: boolean;
  onFileSelect: (filePath: string, isMultiple?: boolean) => void;
  onFileDoubleClick: (filePath: string, isDirectory: boolean) => void;
  isFileSelected: (filePath: string) => boolean;
}

const GridView: React.FC<GridViewProps> = ({
  items,
  selectedFiles,
  isLoading,
  onFileSelect,
  onFileDoubleClick,
  isFileSelected
}) => {

  // 渲染文件图标
  const renderFileIcon = (item: FileItem) => {
    const color = FileService.getFileTypeColor(item);
    
    if (item.is_directory) {
      return (
        <FileIconContainer color={color}>
          <FolderOutlined />
        </FileIconContainer>
      );
    }
    
    // 根据文件类型显示不同图标
    let IconComponent = FileOutlined;
    
    switch (item.file_type) {
      case 'image':
        IconComponent = FileOutlined; // 可以替换为图片图标
        break;
      case 'video':
        IconComponent = FileOutlined; // 可以替换为视频图标
        break;
      case 'audio':
        IconComponent = FileOutlined; // 可以替换为音频图标
        break;
      case 'document':
        IconComponent = FileOutlined; // 可以替换为文档图标
        break;
      case 'archive':
        IconComponent = FileOutlined; // 可以替换为压缩包图标
        break;
      case 'code':
        IconComponent = FileOutlined; // 可以替换为代码图标
        break;
      default:
        IconComponent = FileOutlined;
    }
    
    return (
      <FileIconContainer color={color}>
        <IconComponent />
      </FileIconContainer>
    );
  };

  // 渲染文件信息
  const renderFileInfo = (item: FileItem) => {
    if (item.is_directory) {
      return (
        <FileInfo>
          <Text type="secondary">文件夹</Text>
        </FileInfo>
      );
    }
    
    return (
      <FileInfo>
        <div>{FileService.formatFileSize(item.size)}</div>
        <div>{FileService.formatModifiedTime(item.modified_time)}</div>
      </FileInfo>
    );
  };

  // 处理卡片点击
  const handleCardClick = (item: FileItem, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd + 点击：多选
      onFileSelect(item.path, true);
    } else {
      // 普通点击：单选
      onFileSelect(item.path, false);
    }
  };

  // 处理卡片双击
  const handleCardDoubleClick = (item: FileItem) => {
    onFileDoubleClick(item.path, item.is_directory);
  };

  // 处理复选框变化
  const handleCheckboxChange = (item: FileItem, event: React.MouseEvent) => {
    event.stopPropagation();
    onFileSelect(item.path, true);
  };

  if (isLoading) {
    return (
      <GridContainer>
        <LoadingContainer>
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            tip="加载中..."
          />
        </LoadingContainer>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      <GridContent>
        {items.map((item) => {
          const selected = isFileSelected(item.path);
          
          return (
            <FileCard
              key={item.path}
              selected={selected}
              hoverable
              size="small"
              onClick={(event) => handleCardClick(item, event)}
              onDoubleClick={() => handleCardDoubleClick(item)}
            >
              {/* 选择框 */}
              <CheckboxContainer>
                <Checkbox
                  checked={selected}
                  onChange={(e) => handleCheckboxChange(item, e.nativeEvent)}
                />
              </CheckboxContainer>

              {/* 文件图标 */}
              {renderFileIcon(item)}

              {/* 文件名 */}
              <FileName>
                <Text ellipsis={{ tooltip: item.name }}>
                  {item.name}
                </Text>
              </FileName>

              {/* 文件信息 */}
              {renderFileInfo(item)}
            </FileCard>
          );
        })}
      </GridContent>
    </GridContainer>
  );
};

export default GridView;
