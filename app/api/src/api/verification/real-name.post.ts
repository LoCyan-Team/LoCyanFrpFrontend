import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PostRealName extends API {
  constructor(params: { user_id: number; name: string; id_card: string }) {
    super("/verification/real-name", Method.POST, params, {});
  }
}
