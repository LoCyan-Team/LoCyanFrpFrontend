import { API } from "../type/api";
import { Method } from "../type/method";

export class GetDomains extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/domains", Method.GET, params, {});
  }
}

export interface GetDomainsResponse {
  "list": {
      "id": number,
      "domain": string,
      "icp_id": number | null
    }[],
  "pagination": {
    "count": number
  }
}