import { API } from "../types/api";
import { Method } from "../types/method";

export class GetCaptcha extends API {
  constructor(params: { action: string }) {
    super("/captcha", Method.GET, params, {});
  }
}

export interface GetCaptchaResponse {
  id: string;
  type: string;
}
