import { useMainStore } from "~/store/main";
import { Response } from "@/api/src/type/response";
import { Method } from "@/api/src/type/method";
import type { API } from "@/api/src/type/api";
import { FetchError } from "ofetch";

// ApiUrlConfig
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

// DefaultApiUrlConfig
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
  private urlConfig: ApiUrlConfig;
  private currentBaseURL: string;

  constructor(
    token?: string,
    timeout = 10000,
    apiUrlConfig: ApiUrlConfig = new DefaultApiUrlConfig(),
  ) {
    this.token = token;
    this.urlConfig = apiUrlConfig;
    this.currentBaseURL = apiUrlConfig.v3.main;
  }

  /**
   * 执行 API 请求
   * @param api API 请求配置
   * @returns 包含响应数据的 Promise
   */
  public async execute<T extends object>(api: API): Promise<Response<T>> {
    const requestConfig: FetchOptions = {
      method: api.method,
      headers: {
        ...api.headers,
      },
      server: false,
    };

    // 添加 Authorization header
    if (this.token) {
      (requestConfig.headers as Record<string, string>).Authorization =
        `Bearer ${this.token}`;
    }

    switch (api.method) {
      case Method.GET:
      case Method.DELETE:
        if (api.params) {
          requestConfig.params = api.params;
        }
        break;
      case Method.POST:
      case Method.PUT:
      case Method.PATCH:
        if (api.params) {
          (requestConfig.headers as Record<string, string>)["Content-Type"] =
            "application/x-www-form-urlencoded";
          requestConfig.body = this.toUrlEncoded(api.params);
        }
        break;
    }

    let result;

    try {
      result = await $fetch<T>(api.endpoint, {
        ...requestConfig,
        baseURL: this.currentBaseURL,
      });
      return this.buildResponse(result);
    } catch (error: unknown) {
      // 捕获 FetchError
      if (error instanceof FetchError) {
        if (!error.response && this.currentBaseURL === this.urlConfig.v3.main) {
          this.currentBaseURL = this.urlConfig.v3.backup;

          try {
            result = await $fetch<T>(api.endpoint, {
              ...requestConfig,
              baseURL: this.currentBaseURL,
            });
            return this.buildResponse(result);
          } catch (retryError: unknown) {
            return this.buildResponse(retryError);
          }
        } else return this.buildResponse(error);
      } else return this.buildResponse(error);
    }
  }

  private toUrlEncoded(data: Record<string, unknown>): string {
    const params = new URLSearchParams();
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        params.append(key, data[key]);
      }
    }
    return params.toString();
  }

  private buildResponse<T extends object>(response: unknown): Response<T> {
    let status: number;
    let message: string;
    let data: T | null;

    if (response instanceof FetchError) {
      // 如果是 FetchError，rawResult 是 FetchError 对象
      status = response.response?.status || 500;
      message = response.response?._data?.message || response.message;
      data = response.response?._data?.data;
    } else if (response instanceof Error) {
      // 如果是其他 Error 对象
      status = -1;
      message = response.message;
      data = null;
    } else {
      response as RawResponse<typeof response.data>;
      status = response.status;
      message = response.message;
      data = response.data;
    }
    const finalData: T = data ?? ({} as T);

    return new Response(status, message, finalData);
  }
}

/**
 * 用于在 Nuxt 应用中获取 API 客户端实例的 Composable
 * @param options 配置选项，例如是否需要认证
 * @returns Client 实例
 * @throws Error 如果需要认证但 token 为空
 */
export function useApiClient(
  options: {
    auth?: boolean;
  } = {
    auth: true,
  },
): Client {
  const mainStore = useMainStore();

  let api: Client;
  if (options.auth) {
    if (mainStore.token === null || mainStore.token === undefined) {
      throw new Error(
        "Authentication token required, but token is null or undefined.",
      );
    }
    api = new Client(mainStore.token);
  } else {
    api = new Client();
  }

  return api;
}
