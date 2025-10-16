import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PostAuthorize extends API {
  constructor(params: {
    user_id: number;
    app_id: number;
    redirect_url?: string;
    scope_ids: number[];
    mode: string;
  }) {
    super("/auth/oauth/authorize", Method.POST, params, {});
  }
}

export interface PostAuthorizeCallbackResponse {
  refresh_token: string;
}

export interface PostAuthorizeCodeResponse {
  code: string;
}

