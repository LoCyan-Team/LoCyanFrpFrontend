import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetIcp extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/domain/icp", Method.GET, params, {});
  }
}

export interface GetIcpResponse {
  list: {
    id: number;
    icp: string;
    unit_name: string;
    nature_name: string;
    domain: string;
  }[];
  pagination: {
    count: number;
  };
}
