/**
 * 列表视图组件
 */
import React from 'react';
import { Table, Typography, Checkbox } from 'antd';
import { 
  CaretUpOutlined, 
  CaretDownOutlined,
  FolderOutlined,
  FileOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { FileItem, SortField, SortOrder } from '@/types/file';
import { FileService } from '@/services/fileService';

const { Text } = Typography;

const ListContainer = styled.div`
  height: 100%;
  
  .ant-table {
    height: 100%;
    
    .ant-table-container {
      height: 100%;
      
      .ant-table-body {
        height: calc(100% - 55px);
        overflow-y: auto;
      }
    }
    
    .ant-table-thead > tr > th {
      background: #fafafa;
      border-bottom: 2px solid #f0f0f0;
      font-weight: 600;
      padding: 12px 16px;
      
      &:hover {
        background: #f0f0f0;
      }
    }
    
    .ant-table-tbody > tr {
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: #f5f5f5;
      }
      
      &.selected {
        background: #e6f7ff;
        
        &:hover {
          background: #bae7ff;
        }
      }
      
      > td {
        padding: 8px 16px;
        border-bottom: 1px solid #f5f5f5;
      }
    }
  }
`;

const FileIcon = styled.span<{ color: string }>`
  color: ${props => props.color};
  margin-right: 8px;
  font-size: 16px;
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  
  .file-name {
    margin-left: 4px;
    word-break: break-all;
  }
`;

const SortIcon = styled.span`
  margin-left: 4px;
  color: #1890ff;
`;

const CheckboxCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ListViewProps {
  items: FileItem[];
  sortField: SortField;
  sortOrder: SortOrder;
  selectedFiles: string[];
  isLoading: boolean;
  onSort: (field: SortField) => void;
  onFileSelect: (filePath: string, isMultiple?: boolean) => void;
  onFileDoubleClick: (filePath: string, isDirectory: boolean) => void;
  isFileSelected: (filePath: string) => boolean;
}

const ListView: React.FC<ListViewProps> = ({
  items,
  sortField,
  sortOrder,
  selectedFiles,
  isLoading,
  onSort,
  onFileSelect,
  onFileDoubleClick,
  isFileSelected
}) => {

  // 渲染排序图标
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return (
      <SortIcon>
        {sortOrder === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
      </SortIcon>
    );
  };

  // 渲染文件名列
  const renderFileName = (name: string, record: FileItem) => {
    const icon = FileService.getFileIcon(record);
    const color = FileService.getFileTypeColor(record);
    
    return (
      <FileName>
        <FileIcon color={color}>
          {record.is_directory ? <FolderOutlined /> : <FileOutlined />}
        </FileIcon>
        <span className="file-name">{name}</span>
      </FileName>
    );
  };

  // 渲染文件大小
  const renderFileSize = (size: number, record: FileItem) => {
    if (record.is_directory) {
      return <Text type="secondary">--</Text>;
    }
    return FileService.formatFileSize(size);
  };

  // 渲染修改时间
  const renderModifiedTime = (modifiedTime: string) => {
    return FileService.formatModifiedTime(modifiedTime);
  };

  // 渲染文件类型
  const renderFileType = (fileType: string, record: FileItem) => {
    if (record.is_directory) {
      return '文件夹';
    }
    
    const typeMap: Record<string, string> = {
      'text': '文本文件',
      'code': '代码文件',
      'image': '图片文件',
      'video': '视频文件',
      'audio': '音频文件',
      'document': '文档文件',
      'archive': '压缩文件',
      'file': '文件'
    };
    
    return typeMap[fileType] || '文件';
  };

  // 渲染选择框
  const renderCheckbox = (text: any, record: FileItem) => {
    return (
      <CheckboxCell>
        <Checkbox
          checked={isFileSelected(record.path)}
          onChange={(e) => {
            e.stopPropagation();
            onFileSelect(record.path, true);
          }}
        />
      </CheckboxCell>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '',
      dataIndex: 'select',
      key: 'select',
      width: 50,
      render: renderCheckbox,
    },
    {
      title: (
        <span onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
          名称 {renderSortIcon('name')}
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: renderFileName,
    },
    {
      title: (
        <span onClick={() => onSort('size')} style={{ cursor: 'pointer' }}>
          大小 {renderSortIcon('size')}
        </span>
      ),
      dataIndex: 'size',
      key: 'size',
      width: 120,
      align: 'right' as const,
      render: renderFileSize,
    },
    {
      title: (
        <span onClick={() => onSort('type')} style={{ cursor: 'pointer' }}>
          类型 {renderSortIcon('type')}
        </span>
      ),
      dataIndex: 'file_type',
      key: 'file_type',
      width: 120,
      render: renderFileType,
    },
    {
      title: (
        <span onClick={() => onSort('modified_time')} style={{ cursor: 'pointer' }}>
          修改时间 {renderSortIcon('modified_time')}
        </span>
      ),
      dataIndex: 'modified_time',
      key: 'modified_time',
      width: 160,
      render: renderModifiedTime,
    },
  ];

  // 处理行点击
  const handleRowClick = (record: FileItem, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd + 点击：多选
      onFileSelect(record.path, true);
    } else {
      // 普通点击：单选
      onFileSelect(record.path, false);
    }
  };

  // 处理行双击
  const handleRowDoubleClick = (record: FileItem) => {
    onFileDoubleClick(record.path, record.is_directory);
  };

  return (
    <ListContainer>
      <Table
        columns={columns}
        dataSource={items}
        rowKey="path"
        loading={isLoading}
        pagination={false}
        size="small"
        scroll={{ y: '100%' }}
        rowClassName={(record) => isFileSelected(record.path) ? 'selected' : ''}
        onRow={(record) => ({
          onClick: (event) => handleRowClick(record, event),
          onDoubleClick: () => handleRowDoubleClick(record),
        })}
        locale={{
          emptyText: '暂无文件'
        }}
      />
    </ListContainer>
  );
};

export default ListView;
