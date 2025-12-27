import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PutTotp extends API {
  constructor(params: { user_id: number; code: number }) {
    super("/user/totp", Method.PUT, params, {});
  }
}
