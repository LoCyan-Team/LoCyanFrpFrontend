import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class DeletePasskey extends API {
  constructor(params: { user_id: number }) {
    super("/user/webauthn/passkey", Method.DELETE, params, {});
  }
}
