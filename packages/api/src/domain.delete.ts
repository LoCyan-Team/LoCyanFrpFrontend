import { API } from "../types/api";
import { Method } from "../types/method";

export class DeleteDomain extends API {
  constructor(params: { user_id: number; domain_id: number }) {
    super("/domain", Method.DELETE, params, {});
  }
}
