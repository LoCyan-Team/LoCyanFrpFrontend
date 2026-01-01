import { API } from "../../../../types/api";
import { Method } from "../../../../types/method";

export class DeleteApp extends API {
  constructor(params: { user_id: number; app_id: number }) {
    super("/auth/oauth/authorization/app", Method.DELETE, params, {});
  }
}
