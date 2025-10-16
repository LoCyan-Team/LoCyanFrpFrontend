import { API } from "../type/api";
import { Method } from "../type/method";

export class PostSign extends API {
  constructor(params: { user_id: number }) {
    super("/sign", Method.POST, params, {});
  }
}
