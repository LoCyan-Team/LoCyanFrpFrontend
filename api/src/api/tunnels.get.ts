import { API } from "../type/api";
import { Method } from "../type/method";

export class GetTunnels extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/tunnels", Method.GET, params, {});
  }
}
