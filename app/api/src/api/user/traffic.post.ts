import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PostTraffic extends API {
  constructor(params: { user_id: number }) {
    super("/user/traffic", Method.POST, params, {});
  }
}
