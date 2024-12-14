## lerna6 + npm + workspaces + vite

### 常用命令

```bash
# 启动项目
npm run dev -w=app
npm run dev --workspace=app
npm run dev --workspace=demo1 --workspace=demo2
lerna run dev --scope app

# 所有项目安装依赖
npm i typescript
npm i typescript -D

## 安装某个项目的依赖
npm i typescript -w=app
npm i typescript -D -w=app
npm install typescript --workspace=app
npm install typescript -D --workspace=app
```

### 包版本

- `node: ^16.13.2`
- `npm: ^8.1.0`
- `lerna: ^6.5.1`
- `vite: ^5.4.10`

### 开启 [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)

- 命令行执行 `npx lerna init`, 初始化项目

- `lerna.json` 中添加下面配置

  ```json
  {
    "npmClient": "npm",
    "packages": ["packages/*"]
  }
  ```

- `package.json` 中添加下面配置

  ```json
  {
    "workspaces": ["packages/*"]
  }
  ```

- 然后在根目录下创建 `packages` 目录 <font color="red">（注意：名称要与上面配置的 `packages/*` 目录名称一致）</font>

### 进入 `packages` 创建主应用 `app`

- 依次执行下面命令

  ```bash
  # 进入 packages 目录
  cd ./packages

  # 创建主应用 app
  npm create vite@5

  # Project name
  app

  # Select a framework
  React

  # Select a variant
  TypeScript + SWC
  ```

- 在 `packages/app/vite.config.ts` 文件中配置端口号

  ```typescript
  export default defineConfig({
    server: {
      port: 8000,
    },
    ... // 其他配置
  });
  ```

### 进入 `packages` 创建子应用 `demo1`

- 依次执行下面命令

  ```bash
  # 进入 packages 目录
  cd ./packages

  # 创建子应用 demo1
  npm create vite@5

  # Project name
  demo1

  # Select a framework
  React

  # Select a variant
  TypeScript + SWC
  ```

- 在 `packages/demo1/vite.config.ts` 文件中配置端口号

  ```typescript
  export default defineConfig({
    server: {
      port: 8001,
    },
    ... // 其他配置
  });
  ```

### 进入 `packages` 创建子应用 `demo2`

- 依次执行下面命令

  ```bash
  # 进入 packages 目录
  cd ./packages

  # 创建子应用 demo2
  npm create vite@5

  # Project name
  demo2

  # Select a framework
  React

  # Select a variant
  TypeScript + SWC
  ```

- 在 `packages/demo2/vite.config.ts` 文件中配置端口号

  ```typescript
  export default defineConfig({
    server: {
      port: 8002,
    },
    ... // 其他配置
  });
  ```

### 安装所需依赖

- 删除根目录下的 `node_modules` 文件夹与 `package-lock.json` 文件

- 在根目录下运行 `npm install` 安装依赖

- 给 `app`、`demo`、`demo2` 安装所需的包 <font color="red">（这里可以将公用的包提取到 npm 仓库，然后在各个项目中安装, 这里不做演示）</font>

  ```bash
  # 在根目录下安装antd与react-router-dom
  npm i antd react-router-dom -w=app -w=demo1 -w=demo2
  ```

### 配置主应用

- 在 `app` 项目中安装 [qiankun](https://qiankun.umijs.org/zh/guide)

  ```bash
  # 根目录下执行
  npm i qiankun -w=app
  ```

- [文件目录结构](https://github.com/zxiaosi/lerna-project/tree/lerna8-pnpm-workspaces-vite/)

  ```bash
   ├── public
   ├── src
      ├── layout
        ├── index.tsx
        ├── microApp.tsx
      ├── router
        ├── index.tsx
      ├── App.tsx
      ├── index.css
      ├── main.tsx
   ├── vite.config.ts
  ```

- 修改 `packages/app/src/layout/microApp.tsx` 文件内容如下

  ```typescript
  import { start } from 'qiankun';
  import { useEffect } from 'react';

  const MicroApp = () => {
    /** 加载子应用 */
    const handleLoadMicroApp = () => {
      if (!window.qiankunStarted) {
        window.qiankunStarted = true;
        start();
      }
    };

    useEffect(() => {
      handleLoadMicroApp();
    }, []);

    return (
      <div>
        <div id="subapp"></div>
      </div>
    );
  };

  export default MicroApp;
  ```

- 修改 `packages/app/src/layout/index.tsx` 文件内容如下

  ```typescript
  import React, { useState } from 'react';
  import { Layout, Menu } from 'antd';
  import { Outlet, useNavigate } from 'react-router-dom';
  const { Header, Content, Footer, Sider } = Layout;
  import MicroApp from './microApp';

  /** 菜单栏配置 */
  const menus = [
    { key: 'home', label: 'Home', meta: { path: '/home' } },
    {
      key: 'docs',
      label: 'Docs',
      children: [
        { key: 'test1', label: 'Test1', meta: { path: '/docs/test1' } },
        { key: 'test2', label: 'Test2', meta: { path: '/docs/test2' } },
      ],
    },
    {
      key: 'demo1',
      label: 'Demo1',
      children: [
        { key: 'temp1', label: 'Temp1', meta: { path: '/demo1/temp1' } },
        { key: 'temp2', label: 'Temp2', meta: { path: '/demo1/temp2' } },
      ],
    },
    {
      key: 'demo2',
      label: 'Demo2',
      meta: { path: '/demo2' },
    },
  ];

  const App: React.FC = () => {
    const navigate = useNavigate();

    const [selectedKeys, setSelectedKeys] = useState<string[]>(['home']); // 控制菜单栏的选中状态

    /** 菜单栏点击事件 */
    const handleClick = (e: any) => {
      setSelectedKeys([e.key]);
      navigate(e?.item?.props?.meta?.path);
    };

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <Menu theme="dark" selectedKeys={selectedKeys} mode="inline" items={menus} onClick={handleClick} />
        </Sider>

        <Layout>
          <Header style={{ padding: 0, background: '#fff' }} />
          <Content style={{ margin: '0 16px' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: '#fff',
                borderRadius: 16,
                margin: '16px 0',
              }}>
              {/* 这里渲染子路由 */}
              <Outlet />
              {/* 这里挂载微应用 */}
              <MicroApp />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>zxiaosi ©{new Date().getFullYear()}</Footer>
        </Layout>
      </Layout>
    );
  };

  export default App;
  ```

- 修改 `packages/app/src/router/index.tsx` 文件内容如下

  ```typescript
  import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
  import BaseLayout from '../layout/index';

  /** 路由配置 */
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/home" replace={true} />, // 重定向
    },
    {
      path: '/',
      element: <BaseLayout />,
      errorElement: <>BaseLayout Error</>,
      children: [
        {
          path: '/home',
          element: <>主应用 Home</>,
        },
        {
          path: '/docs',
          element: <Outlet />,
          children: [
            { path: '/docs/test1', element: <>主应用 Docs Test1</> },
            { path: '/docs/test2', element: <>主应用 Docs Test2</> },
          ],
        },
        {
          path: '/demo1',
          element: <Navigate to="/demo1/temp1" replace={true} />,
          errorElement: <>子应用 demo1 Error</>,
          children: [
            {
              path: '/demo1/temp1',
              element: <></>,
            },
            {
              path: '/demo1/temp2',
              element: <></>,
            },
          ],
        },
        {
          path: '/demo2',
          element: <></>,
          errorElement: <>子应用 demo2 Error</>,
        },
      ],
    },
    {
      path: '/login',
      element: <>Login</>,
    },
  ]);

  export default router;
  ```

- 修改 `packages/app/src/App.tsx` 文件内容如下

  ```typescript
  import router from './router';
  import { RouterProvider } from 'react-router-dom';

  function App() {
    return <RouterProvider router={router} />;
  }

  export default App;
  ```

- 修改 `packages/app/src/index.css` 文件内容如下

  ```css
  body {
    margin: 0;
    padding: 0;
  }
  ```

- 修改 `packages/app/src/main.tsx` 文件内容如下

  ```typescript
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
  ```
