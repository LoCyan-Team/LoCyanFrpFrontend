import { API } from "../type/api";
import { Method } from "../type/method";

export class DeleteTunnel extends API {
  constructor(params: { user_id: number; tunnel_id: number }) {
    super("/tunnel", Method.DELETE, params, {});
  }
}
