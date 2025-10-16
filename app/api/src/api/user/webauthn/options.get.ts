import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetOptions extends API {
  constructor(params: { user_id: number }) {
    super("/user/webauthn/options", Method.GET, params, {});
  }
}
