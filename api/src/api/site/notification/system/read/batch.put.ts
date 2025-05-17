import { API } from "../../../../../type/api";
import { Method } from "../../../../../type/method";

export class PutBatch extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/site/notification/system/read/batch", Method.PUT, params, {});
  }
}
