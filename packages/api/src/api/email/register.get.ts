import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetRegister extends API {
  constructor(params: { email: string; captcha_token: string }) {
    super("/email/register", Method.GET, params, {});
  }
}
