import { API } from "../type/api";
import { Method } from "../type/method";

export class GetCaptcha extends API {
  constructor(params: { action: string }) {
    super("/captcha", Method.GET, params, {});
  }
}

export interface GetCaptchaData {
    id:   string;
    type: string;
}