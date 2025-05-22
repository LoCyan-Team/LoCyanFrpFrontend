import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PutUsername extends API {
  constructor(params: { user_id: number; new_username: string }) {
    super("/user/username", Method.PUT, params, {});
  }
}
