import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetEmail extends API {
  constructor(params: { user_id: number; email: string }) {
    super("/email/email", Method.GET, params, {});
  }
}
