import { API } from "../../types/api";
import { Method } from "../../types/method";

export class PostTraffic extends API {
  constructor(params: { user_id: number }) {
    super("/user/traffic", Method.POST, params, {});
  }
}
