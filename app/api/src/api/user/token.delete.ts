import { API } from "../../type/api";
import { Method } from "../../type/method";

export class DeleteToken extends API {
  constructor(params: { user_id: number }) {
    super("/user/token", Method.DELETE, params, {});
  }
}
