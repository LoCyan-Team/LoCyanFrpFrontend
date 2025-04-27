import { API } from "../type/api";
import { Method } from "../type/method";

export class Captcha extends API {
  constructor(params: Record<string, unknown>) {
    super("/captcha", Method.GET, params);
  }
}
