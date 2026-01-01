import { API } from "../../types/api";
import { Method } from "../../types/method";

export class DeleteBatch extends API {
  constructor(params: { user_id: number; tunnel_ids: number[] }) {
    super("/tunnel/batch", Method.DELETE, params, {});
  }
}
