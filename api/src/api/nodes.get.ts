import { API } from "../type/api";
import { Method } from "../type/method";

export class GetNodes extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/nodes", Method.GET, params, {});
  }
}
