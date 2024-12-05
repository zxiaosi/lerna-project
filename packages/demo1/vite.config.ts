import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import qiankun from 'vite-plugin-qiankun';

// https://vitejs.dev/config/
// https://cloud.tencent.com/developer/article/2138139
export default ({ mode }) => {
  const useDevMode = mode === 'development';
  const host = '127.0.0.1';
  const port = 8001;
  const subAppName = 'demo1';
  const base = useDevMode ? `http://${host}:${port}/${subAppName}` : `/${subAppName}`;

  return defineConfig({
    base,
    server: {
      port,
      cors: true, // 作为子应用时，如果不配置，则会引起跨域问题
      origin: `http://${host}:${port}`, // 必须配置，否则无法访问静态资源
    },
    plugins: [
      // 在开发模式下需要把react()关掉
      // https://github.com/tengmaoqing/vite-plugin-qiankun?tab=readme-ov-file#3dev%E4%B8%8B%E4%BD%9C%E4%B8%BA%E5%AD%90%E5%BA%94%E7%94%A8%E8%B0%83%E8%AF%95
      ...[useDevMode ? [] : [react()]],
      qiankun(subAppName, { useDevMode }),
    ],
  });
};
