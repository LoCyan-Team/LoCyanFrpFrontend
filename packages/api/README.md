# API

安装依赖:

```bash
bun install
```

调用:

```ts
// 初始化客户端
// 关于 API 客户端的使用请参考父模块中的定义
const client = useApiClient();

// 调用
// T 为返回值的类型声明
const rs = await client.execute<T>(
  new Awesome({
    // 这里是API的参数，每个导入的 API 都有自己的定义
  }),
);

// rs 的结果参考 src/type/response.ts
```
