import { API } from "../type/api";
import { Method } from "../type/method";

export class PostPrize extends API {
  constructor(params: { user_id: number; prize_id: number }) {
    super("/prize", Method.POST, params, {});
  }
}
