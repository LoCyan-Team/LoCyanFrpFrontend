import { API } from "../../types/api";
import { Method } from "../../types/method";

export class PostTotp extends API {
  constructor(params: { user_id: number }) {
    super("/user/totp", Method.POST, params, {});
  }
}
export interface PostTotpResponse {
  secret: string;
  url: string;
}
