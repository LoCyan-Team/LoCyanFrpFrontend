import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PostAuthorize extends API {
  constructor(params: {
    user_id: number;
    app_id: number;
    redirect_url: string;
    scope_ids: number[];
  }) {
    super("/auth/oauth/authorize", Method.POST, params, {});
  }
}

export interface PostAuthorizeResponse {
  refresh_token: string;
}
