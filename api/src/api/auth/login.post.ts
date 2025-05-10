import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PostLogin extends API {
  constructor(params: {
    user: string;
    password: string;
    captcha_id: string;
    captcha_token: string;
    captcha_server?: string;
  }) {
    super("/auth/login", Method.POST, params, {});
  }
}


export interface PostLoginData {
    user_id:   number;
    token:     string;
    frp_token: string;
    user_info: UserInfo;
}

export interface UserInfo {
    username:      string;
    email:         string;
    group:         Group;
    limit:         Limit;
    avatar:        string;
    traffic:       number;
    register_time: string;
}

export interface Group {
    id:   number;
    name: string;
}

export interface Limit {
    tunnel:   number;
    inbound:  number;
    outbound: number;
}
