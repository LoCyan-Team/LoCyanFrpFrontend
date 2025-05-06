import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetPassword extends API {
  constructor(params: {
    user: string;
    captcha_id: string;
    captcha_token: string;
    captcha_server?: string;
}) {
    super("/email/password", Method.GET, params, {});
  }
}
