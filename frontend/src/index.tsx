/**
 * 应用入口文件
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 创建根元素
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 如果是开发环境，启用热模块替换
if (module.hot) {
  module.hot.accept();
}
