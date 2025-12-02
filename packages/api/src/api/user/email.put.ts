import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PutEmail extends API {
  constructor(params: { user_id: number; verify_code: number }) {
    super("/user/email", Method.PUT, params, {});
  }
}
