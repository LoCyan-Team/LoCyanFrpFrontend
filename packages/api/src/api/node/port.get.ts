import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetPort extends API {
  constructor(params: { user_id: number; node_id: number }) {
    super("/node/port", Method.GET, params, {});
  }
}

export interface GetPortResponse {
  port: number;
}
