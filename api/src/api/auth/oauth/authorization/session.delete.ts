import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class DeleteSession extends API {
  constructor(params: {
    user_id: number;
    app_id: number;
    session_id?: string;
  }) {
    super("/auth/oauth/authorization/session", Method.DELETE, params, {});
  }
}
