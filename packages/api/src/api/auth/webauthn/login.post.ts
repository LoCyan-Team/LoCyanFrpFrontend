import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PostLogin extends API {
  constructor(params: { response_json: string }) {
    super("/auth/webauthn/login", Method.POST, params, {});
  }
}

export interface PostLoginResponse {
  frp_token: string;
  token: string;
  /**
   * 用户 ID
   */
  user_id: number;
  user_info: {
    avatar: string;
    email: string;
    group: {
      id: number;
      name: string;
    };
    limit: {
      inbound: number;
      outbound: number;
      tunnel: number;
    };
    register_time: string;
    traffic: number;
    username: string;
  };
}
