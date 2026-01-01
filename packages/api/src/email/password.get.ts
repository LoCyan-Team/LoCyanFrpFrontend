import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetPassword extends API {
  constructor(params: { user: string; captcha_token: string }) {
    super("/email/password", Method.GET, params, {});
  }
}

export interface GetPasswordResponse {
  user_id: number;
}
