import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetDns extends API {
  constructor(params: { user_id: number; domain_id: number }) {
    super("/domain/verification/dns", Method.GET, params, {});
  }
}
