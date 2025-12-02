import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetDns extends API {
  constructor(params: { user_id: number; domain: string }) {
    super("/domain/verification/dns", Method.GET, params, {});
  }
}
