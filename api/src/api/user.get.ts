import { API } from "../type/api";
import { Method } from "../type/method";

export class GetUser extends API {
  constructor(params: { user_id: string }) {
    super("/user", Method.GET, params, {});
  }
}
