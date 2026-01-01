import { API } from "../../types/api";
import { Method } from "../../types/method";

export class PutEmail extends API {
  constructor(params: { user_id: number; verify_code: number }) {
    super("/user/email", Method.PUT, params, {});
  }
}
