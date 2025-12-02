import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetRealPerson extends API {
  constructor(params: { user_id: number }) {
    super("/verification/real-person", Method.GET, params, {});
  }
}
