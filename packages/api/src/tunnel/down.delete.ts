import { API } from "../../types/api";
import { Method } from "../../types/method";

export class DeleteDown extends API {
  constructor(params: { user_id: number; tunnel_id: number }) {
    super("/tunnel/down", Method.DELETE, params, {});
  }
}
