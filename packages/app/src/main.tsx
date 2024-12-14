import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerMicroApps, RegistrableApp } from 'qiankun';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/** 子应用配置 */
const microApps: Array<RegistrableApp<any>> = [
  {
    name: 'demo1',
    entry: '//localhost:8001',
    container: '#subapp', // 子应用挂载的容器
    activeRule: '/demo1',
  },
  {
    name: 'demo2',
    entry: '//localhost:8002',
    container: '#subapp', // 子应用挂载的容器
    activeRule: '/demo2',
  },
];

/** 注册子应用 */
registerMicroApps(microApps);
