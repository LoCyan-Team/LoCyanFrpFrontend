import { API } from "../../types/api";
import { Method } from "../../types/method";

export class PutUsername extends API {
  constructor(params: { user_id: number; new_username: string }) {
    super("/user/username", Method.PUT, params, {});
  }
}
