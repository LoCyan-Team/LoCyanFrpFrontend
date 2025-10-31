import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PutDns extends API {
  constructor(params: { user_id: number; domain: string }) {
    super("/domain/verification/dns", Method.PUT, params, {});
  }
}

export interface PutDnsResponse {
  record_type: string
  record_data: string
}
