import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QiankunProps, renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

/** 渲染函数 */
const render = (container?: HTMLElement) => {
  const app = container || (document.getElementById('root') as HTMLDivElement);
  createRoot(app).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

/** Qiankun 生命周期钩子 */
const qiankun = () => {
  renderWithQiankun({
    bootstrap() {
      console.warn('App bootstrap');
    },
    async mount(props: QiankunProps) {
      console.warn('App mount');
      render(props.container);
    },
    update: (props: QiankunProps) => {
      console.warn('App update', props);
    },
    unmount: (props: QiankunProps) => {
      console.warn('App unmount', props);
    },
  });
};

// 检查是否在 Qiankun 环境中
console.log('qiankunWindow', qiankunWindow.__POWERED_BY_QIANKUN__);

if (qiankunWindow.__POWERED_BY_QIANKUN__) qiankun();
else render();
