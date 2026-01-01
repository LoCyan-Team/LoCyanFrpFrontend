import { API } from "../types/api";
import { Method } from "../types/method";

export class PostMessage extends API {
  constructor(params: { user_id: number; context: string }) {
    super("/message", Method.POST, params, {});
  }
}
