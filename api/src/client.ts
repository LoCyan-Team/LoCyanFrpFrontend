import axios from "axios";
import QS from "qs";
import { Method } from "./type/method";
import type {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosInstance,
  AxiosResponse,
} from "axios";
import type { API } from "./type/api";
import { Response } from "./type/response";

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
    // main: "http://localhost:8080/default",
    main: "https://api.locyanfrp.cn/v3",
    backup: "https://backup.api.locyanfrp.cn/v3",
  };
}

export class Client {
  private token: string | undefined;

  private instance: AxiosInstance;

  private urlConfig: ApiUrlConfig;

  constructor(
    token?: string,
    timeout: number = 10000,
    apiUrlConfig: ApiUrlConfig = new DefaultApiUrlConfig(),
  ) {
    this.token = token;
    this.urlConfig = apiUrlConfig;

    this.instance = axios.create({
      baseURL: apiUrlConfig.v3.main,
      timeout: timeout,
    });
  }
  public async execute<T extends object>(api: API): Promise<Response<T>> {
    let response: AxiosResponse | AxiosError;
    switch (api.method) {
      case Method.GET:
        response = await this.instance.get(api.endpoint, {
          params: api.params,
          headers: {
            ...api.headers,
          },
        });
        break;
      case Method.POST:
        response = await this.instance.post(
          api.endpoint,
          QS.stringify(api.params, { arrayFormat: "repeat" }),
          {
            headers: {
              ...api.headers,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        break;
      case Method.PUT:
        response = await this.instance.put(
          api.endpoint,
          QS.stringify(api.params, { arrayFormat: "repeat" }),
          {
            headers: {
              ...api.headers,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        break;
      case Method.PATCH:
        response = await this.instance.patch(
          api.endpoint,
          QS.stringify(api.params, { arrayFormat: "repeat" }),
          {
            headers: {
              ...api.headers,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        break;
      case Method.DELETE:
        response = await this.instance.delete(api.endpoint, {
          params: api.params,
          headers: {
            ...api.headers,
          },
        });
        break;
    }
    return this.buildResponse(response!);
  }

  public init() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers!.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        // 处理响应错误
        if (error.response) return error;
        else {
          // 如果请求失败并且没有响应，尝试备用域名重试
          const config = error.config!;
          if (config.baseURL === this.urlConfig.v3.backup) return error;
          config.baseURL = this.urlConfig.v3.backup;

          // 重试请求
          let response;
          try {
            response = axios(config);
          } catch {
            return error;
          }
          return response;
        }
      },
    );
  }

  private buildResponse<T extends object>(
    result: AxiosResponse | AxiosError,
  ): Response<T> {
    return new Response(
      // @ts-expect-error Vue eslint rules bug
      result?.status ?? result?.response?.status,
      // @ts-expect-error Vue eslint rules bug
      result?.data?.message ?? result?.response?.data?.message,
      // @ts-expect-error Vue eslint rules bug
      result?.data?.data ?? result?.response?.data?.data,
    );
  }
}
