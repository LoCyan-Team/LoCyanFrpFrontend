import { API } from "../../type/api";
import { Method } from "../../type/method";

export class DeleteDown extends API {
  constructor(params: { user_id: number; tunnel_id: number }) {
    super("/tunnel/down", Method.DELETE, params, {});
  }
}
