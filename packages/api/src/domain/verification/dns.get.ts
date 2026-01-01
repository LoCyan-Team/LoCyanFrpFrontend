import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class GetDns extends API {
  constructor(params: { user_id: number; domain: string }) {
    super("/domain/verification/dns", Method.GET, params, {});
  }
}
