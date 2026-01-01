import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class DeleteBatch extends API {
  constructor(params: { user_id: number; tunnel_ids: number[] }) {
    super("/tunnel/down/batch", Method.DELETE, params, {});
  }
}

export interface DeleteBatchResponse {
  succeeded: number[];
  failed: number[];
}
