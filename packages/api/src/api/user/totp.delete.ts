import { API } from "../../type/api";
import { Method } from "../../type/method";

export class DeleteTotp extends API {
  constructor(params: { user_id: number }) {
    super("/user/totp", Method.DELETE, params, {});
  }
}
