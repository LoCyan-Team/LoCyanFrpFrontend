import { API } from "../../type/api";
import { Method } from "../../type/method";

export class DeleteBatch extends API {
  constructor(params: { user_id: number; tunnel_ids: number[] }) {
    super("/tunnel/batch", Method.DELETE, params, {});
  }
}
