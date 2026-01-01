import { API } from "../../../../types/api";
import { Method } from "../../../../types/method";

export class PostLogin extends API {
  constructor(params: { code: string }) {
    super("/auth/third-party/qq/login", Method.POST, params, {});
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
