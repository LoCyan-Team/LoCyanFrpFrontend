import { API } from "../../types/api";
import { Method } from "../../types/method";

export class DeleteRealPerson extends API {
  constructor(params: { user_id: number }) {
    super("/verification/real-person", Method.DELETE, params, {});
  }
}
