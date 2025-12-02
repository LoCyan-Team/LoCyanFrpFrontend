import { useMainStore } from "~/store/main";
import { Response } from "@/api/src/type/response";
import { Method } from "@/api/src/type/method";
import type { API } from "@/api/src/type/api";
import { FetchError, type FetchOptions } from "ofetch";
import type { NitroFetchOptions } from "nitropack/types";

export interface ApiUrlConfig {
  v2: {
    main: string;
    backup: string;
  };
  v3: {
    main: string;
    backup: string;
  };
}

export class DefaultApiUrlConfig implements ApiUrlConfig {
  v2 = {
    main: "https://api.locyanfrp.cn/v2",
    backup: "https://backup.api.locyanfrp.cn/v2",
  };
  v3 = {
    // main: "http://localhost:8080/default", // 保持本地调试地址
    main: "https://api.locyanfrp.cn/v3",
    backup: "https://backup.api.locyanfrp.cn/v3",
  };
}

interface RawResponse<T> {
  status: number;
  message: string;
  data: T;
}

export class Client {
  private readonly token: string | undefined;
  private readonly urlConfig: ApiUrlConfig;

  // 使用标志位记录当前是否处于备份节点模式
  private useBackup = false;

  constructor(
    token?: string,
    apiUrlConfig: ApiUrlConfig = new DefaultApiUrlConfig(),
  ) {
    this.token = token;
    this.urlConfig = apiUrlConfig;
  }

  /**
   * 获取当前的 Base URL (基于当前的主/备状态)
   */
  private get currentBaseURL(): string {
    return this.useBackup ? this.urlConfig.v3.backup : this.urlConfig.v3.main;
  }

  /**
   * 执行 API 请求
   */
  public async execute<T extends object>(api: API): Promise<Response<T>> {
    try {
      // 1. 首次尝试
      const result = await this.performFetch<T>(api, this.currentBaseURL);
      return this.buildResponse(result);
    } catch (error) {
      // 2. 故障转移逻辑
      // 如果是 FetchError (网络/HTTP错误)，且当前还在使用主节点，则尝试切换
      if (error instanceof FetchError && !this.useBackup) {
        // 只有当没有 response (即网络连接失败) 或者需要针对特定状态码重试时才切换
        // 这里保留原逻辑：!error.response 意味着通常是网络不通
        if (!error.response) {
          console.warn(
            `Primary API unreachable. Switching to backup: ${this.urlConfig.v3.backup}`,
          );
          this.useBackup = true; // 切换状态（粘性）

          try {
            // 使用新地址重试
            const retryResult = await this.performFetch<T>(
              api,
              this.currentBaseURL,
            );
            return this.buildResponse(retryResult);
          } catch (retryError) {
            // 重试也失败，返回重试的错误
            return this.buildResponse(retryError);
          }
        }
      }

      // 其他情况直接返回错误
      return this.buildResponse(error);
    }
  }

  /**
   * 内部核心请求方法
   * 处理 Headers 构建、参数分类
   */
  private async performFetch<T>(
    api: API,
    baseURL: string,
  ): Promise<RawResponse<T>> {
    const opts: FetchOptions = {
      method: api.method,
      baseURL: baseURL,
      headers: { ...api.headers },
    };

    if (this.token) {
      opts.headers = {
        ...opts.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    if (api.params) {
      switch (api.method) {
        case Method.POST:
        case Method.PUT:
        case Method.PATCH:
          opts.body = this.normalizeParams(api.params);
          break;
        default:
          opts.query = api.params;
          break;
      }
    }

    // 发起请求，期望返回 RawResponse<T> 结构
    return await $fetch<RawResponse<T>>(
      api.endpoint,
      opts as NitroFetchOptions<never>,
    );
  }

  /**
   * 将参数对象规范化为 URLSearchParams
   * 过滤掉 undefined/null 值，并安全转换为字符串
   */
  private normalizeParams(params: Record<string, unknown>): URLSearchParams {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    return searchParams;
  }

  /**
   * 统一响应构建方法
   * 处理正常响应、FetchError 和其他 Error
   */
  private buildResponse<T extends object>(response: unknown): Response<T> {
    let status: number;
    let message: string;
    let data: T | null;

    if (response instanceof FetchError) {
      // 处理 HTTP 错误或解析错误
      status = response.response?.status ?? -1;
      // 尝试读取服务端返回的错误信息
      const errorData = response.data as RawResponse<T> | undefined;
      message = errorData?.message ?? response.message;
      data = errorData?.data ?? null;
    } else if (response instanceof Error) {
      // 处理代码执行异常
      status = -1;
      message = response.message;
      data = null;
    } else {
      // 处理成功响应
      const rawResponse = response as RawResponse<T>;
      status = rawResponse.status;
      message = rawResponse.message;
      data = rawResponse.data;
    }

    // 确保返回的 data 不为 null/undefined，保持原有行为
    const finalData: T = data ?? ({} as T);

    return new Response(status, message, finalData);
  }
}

/**
 * Nuxt Composable
 */
export function useApiClient(
  options: { auth?: boolean } = { auth: true },
): Client {
  const mainStore = useMainStore();

  if (options.auth) {
    if (!mainStore.token) {
      throw new Error(
        "Authentication token required, but token is null or undefined.",
      );
    }
    return new Client(mainStore.token);
  }

  return new Client();
}
