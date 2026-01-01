import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetRealPerson extends API {
  constructor(params: { user_id: number }) {
    super("/verification/real-person", Method.GET, params, {});
  }
}
