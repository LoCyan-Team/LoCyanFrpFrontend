import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetConfig extends API {
  constructor(params: {
    user_id: number;
    tunnel_id?: number;
    node_id?: number;
    format: string;
  }) {
    super("/tunnel/config", Method.GET, params, {});
  }
}

export interface GetConfigResponse {
  config: string;
}
