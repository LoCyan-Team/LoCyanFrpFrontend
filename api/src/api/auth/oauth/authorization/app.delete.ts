import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class DeleteApp extends API {
  constructor(params: {
    user_id: number;
    app_id: number;
  }) {
    super("/auth/authorization/app", Method.DELETE, params, {});
  }
}
