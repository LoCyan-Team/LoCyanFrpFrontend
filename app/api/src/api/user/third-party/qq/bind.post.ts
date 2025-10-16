import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class PostBind extends API {
  constructor(params: { user_id: number; code: string }) {
    super("/user/third-party/qq/bind", Method.POST, params, {});
  }
}
