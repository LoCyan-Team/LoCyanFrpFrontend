import { API } from "../../type/api";
import { Method } from "../../type/method";

export class DeleteIcp extends API {
  constructor(params: { user_id: number; domain_id: number }) {
    super("/domain/icp", Method.DELETE, params, {});
  }
}
