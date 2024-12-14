## lerna8 + pnpm + workspaces + umi

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
"pnpm": "^9.14.4"
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
  npx create-umi@latest

  # What's the target folder name?
  app

  # Pick Umi App Template
  Ant Design Pro

  # Pick Npm Client
  pnpm

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

### 进入 `packages` 创建子应用 `demo1`, `demo2`

- 依次执行下面命令(这里只演示 `demo1`, `demo2` 创建同下)

  ```bash
  # 进入 packages 目录
  cd ./packages

  # 创建子应用 demo1
  npx create-umi@latest

  # What's the target folder name?
  demo1

  # Pick Umi App Template
  Simple App

  # Pick Npm Client
  pnpm

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

- 在根目录下安装 `cross-env` 包 (不是项目根目录)

  ```bash
  pnpm -F=app -F=demo1 -F=demo2 i cross-env -D
  # 或者
  pnpm --filter=app --filter=demo1 --filter=demo2 i cross-env -D
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
  pnpm run dev

  # 进入 packages/demo1 目录
  cd ./packages/demo1
  # 启动子应用
  pnpm run dev

  # 进入 packages/demo2 目录
  cd ./packages/demo2
  # 启动子应用
  pnpm run dev
  ```

  ```bash
  # 根目录下启动主应用
  pnpm -F=app run dev

  # 根目录下启动子应用
  pnpm -F=demo1 run dev

  # 根目录下启动子应用
  pnpm -F=demo2 run dev
  ```

  ```bash
  # 根目录下启动所有应用
  pnpm -r dev
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
  pnpm -F=demo1 -F=demo2 i @umijs/plugins -D
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
