import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class DeleteAll extends API {
  constructor(params: { user_id: number }) {
    super("/user/token/all", Method.DELETE, params, {});
  }
}
