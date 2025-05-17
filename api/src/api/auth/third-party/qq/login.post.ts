import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class PostQQLogin extends API {
  constructor(params: { code: string }) {
    super("/auth/third-party/qq/login", Method.POST, params, {});
  }
}

export interface PostQQLoginResponse {
  user_id: number;
  token: string;
  frp_token: string;
  user_info: {
    username: string;
    email: string;
    group: {
      id: number;
      name: string;
    }
    limit: {
      tunnel: number;
      inbound: number;
      outbound: number;
    };
    avatar: string;
    traffic: number;
    register_time: string;
  };

};