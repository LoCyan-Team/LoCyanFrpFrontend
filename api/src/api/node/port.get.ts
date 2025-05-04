import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetPort extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/node/port", Method.GET, params, {});
  }
}
