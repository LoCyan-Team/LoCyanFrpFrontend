import { API } from "../types/api";
import { Method } from "../types/method";

export class PostPrize extends API {
  constructor(params: { user_id: number; prize_id: number }) {
    super("/prize", Method.POST, params, {});
  }
}
