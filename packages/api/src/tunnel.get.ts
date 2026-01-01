import { API } from "../types/api";
import { Method } from "../types/method";

export class GetTunnel extends API {
  constructor(params: { user_id: number; tunnel_id: number }) {
    super("/tunnel", Method.GET, params, {});
  }
}
