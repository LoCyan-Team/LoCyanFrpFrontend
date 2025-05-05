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
