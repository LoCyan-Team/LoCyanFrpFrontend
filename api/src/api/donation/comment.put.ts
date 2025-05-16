import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PutComment extends API {
  constructor(params: { user_id: number; donation_id: number; comment: string }) {
    super("/donation/comment", Method.PUT, params, {});
  }
}
