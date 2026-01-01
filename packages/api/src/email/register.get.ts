import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetRegister extends API {
  constructor(params: { email: string; captcha_token: string }) {
    super("/email/register", Method.GET, params, {});
  }
}
