import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetIcp extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/domain/icp", Method.GET, params, {});
  }
}
