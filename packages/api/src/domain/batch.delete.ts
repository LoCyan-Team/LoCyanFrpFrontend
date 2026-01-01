import { API } from "../../types/api";
import { Method } from "../../types/method";

export class DeleteBatch extends API {
  constructor(params: { user_id: number; domain_ids: number[] }) {
    super("/domain/batch", Method.DELETE, params, {});
  }
}
