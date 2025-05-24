# API

安装依赖:

```bash
bun install
```

调用:

```ts
import { Client as ApiClient } from "src/client";
import { Awesome } from "src/api/awesome";

// token -> 在此处传入登录令牌
const client = new ApiClient(token);
client.init(); // 初始化客户端

// 调用
// T 为返回值的类型声明
const rs = await client.execute<T>(
  new Awesome({
    // 这里是API的参数，每个导入的 API 都有自己的定义
  }),
);

// rs 的结果参考 src/type/response.ts
```
