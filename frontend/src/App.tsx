/**
 * 主应用组件
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { createGlobalStyle } from 'styled-components';
import MainLayout from './components/Layout/MainLayout';

// 全局样式
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 
                 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', 
                 Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: #f5f5f5;
    overflow: hidden;
  }

  /* 自定义滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    
    &:hover {
      background: #a8a8a8;
    }
  }

  /* Ant Design 组件样式覆盖 */
  .ant-layout {
    background: #ffffff;
  }

  .ant-table-thead > tr > th {
    background: #fafafa !important;
    font-weight: 600;
  }

  .ant-tree .ant-tree-node-content-wrapper {
    border-radius: 4px;
  }

  .ant-breadcrumb a {
    color: #1890ff;
    
    &:hover {
      color: #40a9ff;
    }
  }

  /* 选中状态样式 */
  .file-selected {
    background-color: #e6f7ff !important;
    border-color: #91d5ff !important;
  }

  /* 加载动画 */
  .loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(24, 144, 255, 0.3);
    border-radius: 50%;
    border-top-color: #1890ff;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .ant-layout-sider {
      position: fixed !important;
      z-index: 999;
      height: 100vh;
    }
  }
`;

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30秒
      cacheTime: 300000, // 5分钟
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Ant Design 主题配置
const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: '#ffffff',
      siderBg: '#fafafa',
    },
    Table: {
      headerBg: '#fafafa',
      rowHoverBg: '#f5f5f5',
    },
    Tree: {
      nodeHoverBg: '#e6f7ff',
      nodeSelectedBg: '#1890ff',
    },
    Button: {
      borderRadius: 4,
    },
    Input: {
      borderRadius: 4,
    },
  },
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider 
        locale={zhCN}
        theme={antdTheme}
      >
        <GlobalStyle />
        <MainLayout />
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
