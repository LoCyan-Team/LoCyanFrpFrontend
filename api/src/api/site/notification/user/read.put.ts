import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class PutRead extends API {
  constructor(params: { user_id: number; notification_id: number }) {
    super("/site/notification/user/read", Method.PUT, params, {});
  }
}
