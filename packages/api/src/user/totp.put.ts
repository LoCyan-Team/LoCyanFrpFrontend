import { API } from "../../types/api";
import { Method } from "../../types/method";

export class PutTotp extends API {
  constructor(params: { user_id: number; code: number }) {
    super("/user/totp", Method.PUT, params, {});
  }
}
