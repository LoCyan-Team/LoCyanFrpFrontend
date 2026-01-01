import { API } from "../../../../types/api";
import { Method } from "../../../../types/method";

export class DeleteBind extends API {
  constructor(params: { user_id: number }) {
    super("/user/third-party/qq/bind", Method.DELETE, params, {});
  }
}
