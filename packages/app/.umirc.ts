import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    { path: '/', redirect: '/home' },
    { name: '首页', path: '/home', component: './Home' },
    { name: '权限演示', path: '/access', component: './Access' },
    { name: ' CRUD 示例', path: '/table', component: './Table' },
    // 新增微应用示例
    { name: 'Demo1', path: '/demo1/*', microApp: 'demo1' },
    { name: 'Demo2', path: '/demo2/*', microApp: 'demo2' },
  ],
  qiankun: {
    master: {},
  },
  npmClient: 'pnpm',
});
