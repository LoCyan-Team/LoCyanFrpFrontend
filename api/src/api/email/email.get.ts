import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetEmail extends API {
  constructor(params: {
    user_id: number;
    email: string;
  }) {
    super("/email/email", Method.GET, params, {});
  }
}
