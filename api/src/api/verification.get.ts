import { API } from "../type/api";
import { Method } from "../type/method";

export class GetVerification extends API {
  constructor(params: { user_id: number }) {
    super("/verification", Method.GET, params, {});
  }
}
