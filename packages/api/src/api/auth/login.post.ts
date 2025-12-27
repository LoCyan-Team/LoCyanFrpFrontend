import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PostLogin extends API {
  constructor(params: {
    user: string;
    password: string;
    totp_code?: number;
    captcha_token: string;
  }) {
    super("/auth/login", Method.POST, params, {});
  }
}

export interface PostLoginResponse {
  user_id: number;
  token: string;
  frp_token: string;
  user_info: {
    username: string;
    email: string;
    group: {
      id: number;
      name: string;
    };
    limit: {
      tunnel: number;
      inbound: number;
      outbound: number;
    };
    avatar: string;
    traffic: number;
    register_time: string;
  };
}
