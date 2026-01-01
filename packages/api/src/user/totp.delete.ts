import { API } from "../../types/api";
import { Method } from "../../types/method";

export class DeleteTotp extends API {
  constructor(params: { user_id: number }) {
    super("/user/totp", Method.DELETE, params, {});
  }
}
