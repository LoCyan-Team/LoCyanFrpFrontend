import { API } from "../../types/api";
import { Method } from "../../types/method";

export class DeleteIcp extends API {
  constructor(params: { user_id: number; icp_id: number }) {
    super("/domain/icp", Method.DELETE, params, {});
  }
}
