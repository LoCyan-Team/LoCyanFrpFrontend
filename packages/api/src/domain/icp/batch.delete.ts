import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class DeleteBatch extends API {
  constructor(params: { user_id: number; icp_ids: number[] }) {
    super("/domain/icp/batch", Method.DELETE, params, {});
  }
}
