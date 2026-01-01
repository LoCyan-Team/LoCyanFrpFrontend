import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class PostToken extends API {
  constructor(params: { user_id: number }) {
    super("/user/frp/token", Method.POST, params, {});
  }
}

export interface PostTokenResponse {
  frp_token: string;
}
