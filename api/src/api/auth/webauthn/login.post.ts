import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PostLogin extends API {
  constructor(params: { credential: string }) {
    super("/auth/webauthn/login", Method.POST, params, {});
  }
}



export interface PostLoginData {
    frp_token: string;
    token: string;
    /**
     * 用户 ID
     */
    user_id: number;
    user_info: UserInfo;
}

export interface UserInfo {
    avatar: string;
    email: string;
    group: Group;
    limit: Limit;
    register_time: string;
    traffic: number;
    username: string;
}

export interface Group {
    id: number;
    name: string;
}

export interface Limit {
    inbound: number;
    outbound: number;
    tunnel: number;
}