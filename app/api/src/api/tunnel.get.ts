import { API } from "../type/api";
import { Method } from "../type/method";

export class GetTunnel extends API {
  constructor(params: { user_id: number; tunnel_id: number }) {
    super("/tunnel", Method.GET, params, {});
  }
}
