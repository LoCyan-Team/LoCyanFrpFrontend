import { API } from "../type/api";
import { Method } from "../type/method";

export class GetSign extends API {
  constructor(params: { user_id: number }) {
    super("/sign", Method.GET, params, {});
  }
}

export interface GetSignResponse {
  status: boolean;
  total_sign: number;
  total_get_traffic: number;
  last_sign: string;
}
