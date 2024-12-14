## lerna8 + pnpm + workspaces + vite

### 问题

- `node` 版本小于 `18`, 安装 `vite-plugin-qiankun` 后启动会报错

- 解决方案：更改 `cheerio` 的版本, 详见：[cheerio upgrade problem](https://github.com/cheeriojs/cheerio/issues/4024)

  ```bash
  # 在项目目录下执行
  npm i cheerio@1.0.0-rc.12
  ```

### 常用命令

```bash
# 启动项目
pnpm -F=app run dev
pnpm --filter=app run dev
pnpm --filter=demo1 --filter=demo2 run dev
lerna run dev --scope app

# 所有项目安装依赖
pnpm i typescript
pnpm i typescript -D

## 安装某个项目的依赖
pnpm -F=app i typescript
pnpm -F=app i typescript -D
pnpm --filter=app install typescript
pnpm --filter=app install typescript -D
```

### 包版本

```json
"node": "^20.18.0",
"npm": "^10.8.2",
"lerna": "^8.1.8",
"pnpm": "^9.14.4",
"vite": "^6.0.2"
```

### 开启 [pnpm workspaces](https://pnpm.io/workspaces)

- 命令行执行 `npx lerna init`, 初始化项目

- `lerna.json` 中添加下面配置

  ```json
  {
    "npmClient": "pnpm",
    "packages": ["packages/*"],
    ... // 其他配置
  }
  ```

- 在根目录下创建 `pnpm-workspace.yaml` 并添加下面配置

  ```yaml
  packages:
    - 'packages/*'
  ```

- 然后在根目录下创建 `packages` 目录 <font color="red">（注意：名称要与上面配置的 `packages/*` 目录名称一致）</font>

### 进入 `packages` 创建主应用 `app`

- 依次执行下面命令

  ```bash
  # 进入 packages 目录
  cd ./packages

  # 创建主应用 app
  pnpm create vite

  # Project name
  app

  # Select a framework
  React

  # Pick Npm Client
  pnpm

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
  pnpm create vite

  # Project name
  demo1

  # Select a framework
  React

  # Pick Npm Client
  pnpm

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
  pnpm create vite

  # Project name
  demo2

  # Select a framework
  React

  # Pick Npm Client
  pnpm

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

- 在根目录下运行 `pnpm install` 安装依赖

- 给 `app`、`demo`、`demo2` 安装所需的包 <font color="red">（这里可以将公用的包提取到 npm 仓库，然后在各个项目中安装, 这里不做演示）</font>

  ```bash
  # 在根目录下安装antd与react-router-dom
  pnpm -F=app -F=demo1 -F=demo2 i antd react-router-dom
  ```

### 配置主应用

- 在 `app` 项目中安装 [qiankun](https://qiankun.umijs.org/zh/guide)

  ```bash
  # 根目录下执行
  pnpm -F=app i qiankun
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

### 配置子应用 `demo1`

{% note danger no-icon %}

`node` 版本小于 `18`, 安装 `vite-plugin-qiankun` 后启动会报错 `ReferenceError: ReadableStream is not defined`

解决方案：更改 `cheerio` 的版本, 详见：[cheerio upgrade problem](https://github.com/cheeriojs/cheerio/issues/3993#issuecomment-2283505868)

在 `demo1/package.json` 下添加下面内容 <font>注意不要带 ^ 符号</font>

```bash
{
  ... // 其他配置
  "devDependencies": {
    ... // 其他依赖
    "cheerio": "1.0.0-rc.12"
  }
}
```

最后删除 `node_modules` 文件夹与 `package-lock.json` 文件，重新安装依赖 <font>(重要！！！)</font>

{% endnote %}

- 在 `demo1` 项目中安装 [vite-plugin-qiankun](https://www.npmjs.com/package/vite-plugin-qiankun)

  ```bash
  # 在根目录下执行
  pnpm -F=demo1 i vite-plugin-qiankun
  ```

- [文件目录结构](https://github.com/zxiaosi/lerna-project/tree/lerna8-pnpm-workspaces-vite/)

  ```bash
   ├── public
   ├── src
      ├── router
        ├── index.tsx
      ├── App.tsx
      ├── index.css
      ├── main.tsx
   ├── vite.config.ts
  ```

- 修改 `packages/app/src/router/index.tsx` 文件内容如下

  ```typescript
  import { createBrowserRouter } from 'react-router-dom';

  /** 路由配置 */
  const router = createBrowserRouter([
    {
      path: '/demo1/temp1',
      element: <>temp1</>,
    },
    {
      path: '/demo1/temp2',
      element: <>temp2</>,
    },
  ]);

  export default router;
  ```

- 修改 `packages/app/src/App.tsx` 文件内容如下

  ```typescript
  import router from './router';
  import { RouterProvider } from 'react-router-dom';

  function App() {
    return (
      <>
        <h1>子应用 demo1</h1>
        <RouterProvider router={router} />
      </>
    );
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
  ```

- 修改 `packages/demo1/vite.config.ts` 文件内容如下

  ```typescript
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
  ```

### 配置子应用 `demo2`

{% note danger no-icon %}

`node` 版本小于 `18`, 安装 `vite-plugin-qiankun` 后启动会报错 `ReferenceError: ReadableStream is not defined`

解决方案：更改 `cheerio` 的版本, 详见：[cheerio upgrade problem](https://github.com/cheeriojs/cheerio/issues/3993#issuecomment-2283505868)

在 `demo2/package.json` 下添加下面内容 <font>注意不要带 ^ 符号</font>

```bash
{
  ... // 其他配置
  "devDependencies": {
    ... // 其他依赖
    "cheerio": "1.0.0-rc.12"
  }
}
```

最后删除 `node_modules` 文件夹与 `package-lock.json` 文件，重新安装依赖 <font>(重要！！！)</font>

{% endnote %}

- 在 `demo2` 项目中安装 [vite-plugin-qiankun](https://www.npmjs.com/package/vite-plugin-qiankun)

  ```bash
  # 在根目录下执行
  pnpm -F=demo2 i vite-plugin-qiankun
  ```

- [文件目录结构](https://github.com/zxiaosi/lerna-project/tree/lerna8-pnpm-workspaces-vite/)

  ```bash
   ├── public
   ├── src
      ├── router
        ├── index.tsx
      ├── App.tsx
      ├── index.css
      ├── main.tsx
   ├── vite.config.ts
  ```

- 修改 `packages/app/src/router/index.tsx` 文件内容如下

  ```typescript
  import { createBrowserRouter } from 'react-router-dom';

  /** 路由配置 */
  const router = createBrowserRouter([
    {
      path: '/demo2',
      element: <>demo2</>,
    },
  ]);

  export default router;
  ```

- 修改 `packages/app/src/App.tsx` 文件内容如下

  ```typescript
  import router from './router';
  import { RouterProvider } from 'react-router-dom';

  function App() {
    return (
      <>
        <h1>子应用 demo2</h1>
        <RouterProvider router={router} />
      </>
    );
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
  ```

- 修改 `packages/demo2/vite.config.ts` 文件内容如下

  ```typescript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import qiankun from 'vite-plugin-qiankun';

  // https://vitejs.dev/config/
  // https://cloud.tencent.com/developer/article/2138139
  export default ({ mode }) => {
    const useDevMode = mode === 'development';
    const host = '127.0.0.1';
    const port = 8002;
    const subAppName = 'demo2';
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
  ```

### [更多微前端配置](https://qiankun.umijs.org/zh/guide)

### 添加快捷命令

- 在根目录 `package.json` 中添加下面配置

  ```json
  {
    "scripts": {
      "preinstall": "npx only-allow pnpm",
      "all": "pnpm -r dev",
      "app": "pnpm -F app dev",
      "bootstrap": "lerna bootstrap",
      "clean": "lerna clean && rimraf ./node_modules",
      "demo1": "pnpm -F demo1 dev",
      "demo2": "pnpm -F demo2 dev"
    },
    ... // 其他配置
  }
  ```

- 使用

  ```bash
  # 安装包
  pnpm install
  pnpm run bootstrap

  # 启动主应用
  pnpm run app

  # 启动子应用
  pnpm run demo1

  # 启动子应用
  pnpm run demo2

  # 清空依赖
  pnpm run clean
  ```
