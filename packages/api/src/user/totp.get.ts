import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetTotp extends API {
  constructor(params: { user_id: number }) {
    super("/user/totp", Method.GET, params, {});
  }
}
export interface GetTotpResponse {
  registered: boolean;
}
