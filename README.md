## lerna8 + npm + workspaces + umi

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

```json
"node": "^20.18.0",
"npm": "^10.8.2",
"lerna": "^8.1.8",
```

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

- 然后在根目录下创建 `packages` 目录 <font color="red">（注意：名称要与上面配置的 `packages/*` 目录名称一致）</font

### 注意：`packages` 下的项目中每个包的 `package.json` 都要配置 `name`，否则会报错

### 进入 `packages` 创建主应用 `app`

- 依次执行下面命令

  ```bash
  # 进入 packages 目录
  cd ./packages

  # 创建主应用 app
  npx create-umi@latest

  # What's the target folder name?
  app

  # Pick Umi App Template
  Ant Design Pro

  # Pick Npm Client
  npm

  # Pick Npm Registry (这一步会在 根目录 下创建 `.npmrc` 文件)
  taobao
  ```

- 在 `packages/app/package.json` 中配置 `name`

  ```json
  {
    "name": "app",
    ... // 其他配置
  }
  ```

### 进入 `packages` 创建子应用`demo1`, `demo2`

- 依次执行下面命令(这里只演示 `demo1`, `demo2` 创建同下)

  ```bash
  # 进入 packages 目录
  cd ./packages

  # 创建主应用 app
  npx create-umi@latest

  # What's the target folder name?
  demo1

  # Pick Umi App Template
  Simple App

  # Pick Npm Client
  npm

  # Pick Npm Registry (这一步会在 根目录 下创建 `.npmrc` 文件, 不需要可以删除)
  taobao
  ```

- 在 `packages/app/package.json` 中配置 `name`

  ```json
  {
    "name": "demo1",
    ... // 其他配置
  }
  ```

### 设置应用的启动端口

- 安装 `cross-env` 包

  ```bash
  npm i cross-env -D -w=app -w=demo1 -w=demo2
  # 或者
  npm i cross-env -D --workspace=app --workspace=demo1 --workspace=demo2
  ```

- 配置主应用 `app` 启动端口，在 `packages/app/package.json` 中修改 `scripts`

  ```json
  {
    "scripts": {
      "dev": "cross-env PORT=8000 max dev",
      ... // 其他配置
    }
  }
  ```

- 配置子应用 `demo1` 启动端口，在 `packages/demo1/package.json` 中修改 `scripts`

  ```json
  {
    "scripts": {
      "dev": "cross-env PORT=8001 umi dev",
      ... // 其他配置
    }
  }
  ```

- 配置子应用 `demo2` 启动端口，在 `packages/demo2/package.json` 中修改 `scripts`

  ```json
  {
    "scripts": {
      "dev": "cross-env PORT=8002 umi dev",
      ... // 其他配置
    }
  }
  ```

- 启动应用

  ```bash
  # 进入 packages/app 目录
  cd ./packages/app
  # 启动主应用
  npm run dev

  # 进入 packages/demo1 目录
  cd ./packages/demo1
  # 启动子应用
  npm run dev

  # 进入 packages/demo2 目录
  cd ./packages/demo2
  # 启动子应用
  npm run dev
  ```

  ```bash
  # 根目录下启动主应用
  npm run dev -w=app

  # 根目录下启动子应用
  npm run dev -w=demo1

  # 根目录下启动子应用
  npm run dev -w=demo2
  ```

### 主应用链接子应用

- 在主应用 `./packages/app/.umirc.ts` 中添加下面内容

  ```typescript
  export default {
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
    ... // 其他配置
  };
  ```

- 修改父应用的 `./packages/app/src/app.ts` 文件，导出 `qiankun` 对象

  ```typescript
  export const qiankun = {
    apps: [
      {
        name: 'demo1',
        entry: '//localhost:8001',
      },
      {
        name: 'demo2',
        entry: '//localhost:8002',
      },
    ],
  };
  ```

- 子应用安装 `qiankun` 插件

  ```bash
  npm i @umijs/plugins -D -w=demo1 -w=demo2
  ```

- 在子应用 `./packages/demo1/.umirc.ts` 与 `./packages/demo2/.umirc.ts` 文件中引入 `qiankun` 插件

  ```typescript
  export default {
    plugins: ['@umijs/plugins/dist/qiankun'],
    qiankun: {
      slave: {},
    },
    ... // 其他配置
  };
  ```

- 重新启动主应用与子应用，即可看到主应用中新增了 `Demo1` 与 `Demo2` 两个子应用的链接

### [更多微前端配置](https://umijs.org/docs/max/micro-frontend)

### 添加快捷命令

- 在根目录 `package.json` 中添加下面配置

  ```json
  {
    "scripts": {
      "app": "npm run dev -w=app",
      "bootstrap": "lerna bootstrap",
      "clean": "lerna clean && rimraf ./node_modules",
      "demo1": "npm run dev -w=demo1",
      "demo2": "npm run dev -w=demo2",
      "preinstall": "npx only-allow npm"
    },
    ... // 其他配置
  }
  ```

- 使用

  ```bash
  # 安装包
  npm install
  npm run bootstrap

  # 启动主应用
  npm run app

  # 启动子应用
  npm run demo1

  # 启动子应用
  npm run demo2

  # 清空依赖
  npm run clean
  ```
