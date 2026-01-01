import { API } from "../types/api";
import { Method } from "../types/method";

export class DeleteTunnel extends API {
  constructor(params: { user_id: number; tunnel_id: number }) {
    super("/tunnel", Method.DELETE, params, {});
  }
}
