import { API } from "../types/api";
import { Method } from "../types/method";

export class DeleteApp extends API {
  constructor(params: { user_id: number; app_id: number }) {
    super("/app", Method.DELETE, params, {});
  }
}
