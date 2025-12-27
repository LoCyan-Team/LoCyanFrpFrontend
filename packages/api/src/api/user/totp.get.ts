import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetTotp extends API {
  constructor(params: { user_id: number }) {
    super("/user/totp", Method.GET, params, {});
  }
}
export interface GetTotpResponse {
  registered: boolean;
}
