import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetVerifications extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/domain/verifications", Method.GET, params, {});
  }
}
