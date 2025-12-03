import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class DeleteBatch extends API {
  constructor(params: { user_id: number; domain_ids: number[] }) {
    super("/domain/icp/batch", Method.DELETE, params, {});
  }
}
