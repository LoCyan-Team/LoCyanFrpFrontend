import { API } from "../../types/api";
import { Method } from "../../types/method";

export class DeleteToken extends API {
  constructor(params: { user_id: number }) {
    super("/user/token", Method.DELETE, params, {});
  }
}
