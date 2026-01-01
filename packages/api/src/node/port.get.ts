import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetPort extends API {
  constructor(params: { user_id: number; node_id: number }) {
    super("/node/port", Method.GET, params, {});
  }
}

export interface GetPortResponse {
  port: number;
}
