import { API } from "../../../../types/api";
import { Method } from "../../../../types/method";

export class PutRead extends API {
  constructor(params: { user_id: number; notification_id: number }) {
    super("/site/notification/system/read", Method.PUT, params, {});
  }
}
