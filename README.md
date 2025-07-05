# LoCyanFrp Frontend

第三代 LoCyanFrp 前端，基于 Nuxt.js 开发

## 开发

注意: 启动 dev 服务器前请先关闭 SSR，否则可能会无法正常启动。

```ts
export default defineNuxtConfig({
    // ssr: false // <-- uncomment this
})
```

首先请先安装 Bun

### 安装依赖

```bash
bun install
```

### 启动开发服务器

```bash
bun run dev
```

### 构建

```bash
bun run build
```

## 本地预览

```bash
bun run preview
```

## 技术栈

- Nuxt.js
- NaiveUI
