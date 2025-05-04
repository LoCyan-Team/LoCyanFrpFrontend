import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PutPassword extends API {
  constructor(params: {
    user_id: number;
    old_password: string | undefined;
    new_password: string;
    verify_code: number | undefined;
  }) {
    super("/user/password", Method.PUT, params, {});
  }
}
