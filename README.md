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
