import { API } from "../../../../../types/api";
import { Method } from "../../../../../types/method";

export class PutBatch extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/site/notification/user/read/batch", Method.PUT, params, {});
  }
}
