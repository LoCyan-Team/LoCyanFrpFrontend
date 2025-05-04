import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PostGiven extends API {
  constructor(params: { user_id: number; given_user_id: number }) {
    super("/verification/real-person/given", Method.POST, params, {});
  }
}
