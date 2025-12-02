import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class DeleteBind extends API {
  constructor(params: { user_id: number }) {
    super("/user/third-party/qq/bind", Method.DELETE, params, {});
  }
}
