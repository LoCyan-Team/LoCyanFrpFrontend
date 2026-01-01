import { API } from "../../../../types/api";
import { Method } from "../../../../types/method";

export class PostBind extends API {
  constructor(params: { user_id: number; code: string }) {
    super("/user/third-party/qq/bind", Method.POST, params, {});
  }
}
