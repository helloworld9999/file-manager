/**
 * 工具栏组件
 */
import React, { useState } from 'react';
import { Button, Input, Space, Breadcrumb, Tooltip } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
  SearchOutlined,
  HomeOutlined,
  FolderOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const BreadcrumbContainer = styled.div`
  flex: 1;
  min-width: 0;
  
  .ant-breadcrumb {
    font-size: 14px;
  }
`;

const SearchContainer = styled.div`
  width: 200px;
`;

interface ToolbarProps {
  currentPath: string;
  onNavigateToParent: () => void;
  onRefresh: () => void;
  onNavigateToPath: (path: string) => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentPath,
  onNavigateToParent,
  onRefresh,
  onNavigateToPath,
  canGoBack,
  isLoading
}) => {
  const [searchValue, setSearchValue] = useState('');

  // 解析路径为面包屑
  const getBreadcrumbItems = () => {
    const parts = currentPath.split('\\').filter(Boolean);
    const items = [];

    // 添加根目录
    if (parts.length > 0) {
      items.push({
        title: (
          <span onClick={() => onNavigateToPath(parts[0] + '\\')} style={{ cursor: 'pointer' }}>
            <HomeOutlined /> {parts[0]}
          </span>
        )
      });

      // 添加子目录
      let currentPathBuilder = parts[0] + '\\';
      for (let i = 1; i < parts.length; i++) {
        currentPathBuilder += parts[i] + '\\';
        const pathToNavigate = currentPathBuilder;
        
        items.push({
          title: (
            <span 
              onClick={() => onNavigateToPath(pathToNavigate)} 
              style={{ cursor: 'pointer' }}
            >
              <FolderOutlined /> {parts[i]}
            </span>
          )
        });
      }
    }

    return items;
  };

  const handleSearch = (value: string) => {
    // TODO: 实现搜索功能
    console.log('搜索:', value);
  };

  const handleGoHome = () => {
    onNavigateToPath('C:\\');
  };

  return (
    <ToolbarContainer>
      {/* 导航按钮 */}
      <NavigationButtons>
        <Tooltip title="后退">
          <Button
            icon={<ArrowLeftOutlined />}
            disabled={!canGoBack}
            onClick={onNavigateToParent}
            size="small"
          />
        </Tooltip>
        
        <Tooltip title="前进">
          <Button
            icon={<ArrowRightOutlined />}
            disabled={true} // TODO: 实现前进功能
            size="small"
          />
        </Tooltip>
        
        <Tooltip title="上级目录">
          <Button
            icon={<ArrowUpOutlined />}
            disabled={!canGoBack}
            onClick={onNavigateToParent}
            size="small"
          />
        </Tooltip>
        
        <Tooltip title="刷新">
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={isLoading}
            size="small"
          />
        </Tooltip>
        
        <Tooltip title="主目录">
          <Button
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            size="small"
          />
        </Tooltip>
      </NavigationButtons>

      {/* 面包屑导航 */}
      <BreadcrumbContainer>
        <Breadcrumb items={getBreadcrumbItems()} />
      </BreadcrumbContainer>

      {/* 搜索框 */}
      <SearchContainer>
        <Input
          placeholder="搜索文件..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={() => handleSearch(searchValue)}
          size="small"
        />
      </SearchContainer>
    </ToolbarContainer>
  );
};

export default Toolbar;
