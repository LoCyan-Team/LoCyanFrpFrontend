import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PostDns extends API {
  constructor(params: { user_id: number; record_id: string }) {
    super("/domain/verification/dns", Method.POST, params, {});
  }
}
