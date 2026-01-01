import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class GetToken extends API {
  constructor(params: { user_id: number }) {
    super("/user/frp/token", Method.GET, params, {});
  }
}
