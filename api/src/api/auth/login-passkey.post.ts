import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PostPasskeyLogin extends API {
  constructor(query:{
    credential:string
  }) {
    super(`/auth/webauthn/login?credential=${query.credential}`, Method.POST, {}, {});
  }
}


export interface PostPasskeyLoginData {
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