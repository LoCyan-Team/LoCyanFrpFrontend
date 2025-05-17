import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetUser extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/site/notification/user", Method.GET, params, {});
  }
}
