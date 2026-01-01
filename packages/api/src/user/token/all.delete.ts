import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class DeleteAll extends API {
  constructor(params: { user_id: number }) {
    super("/user/token/all", Method.DELETE, params, {});
  }
}
