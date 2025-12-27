import { API } from "../type/api";
import { Method } from "../type/method";

export class PostMessage extends API {
  constructor(params: { user_id: number; context: string }) {
    super("/message", Method.POST, params, {});
  }
}
