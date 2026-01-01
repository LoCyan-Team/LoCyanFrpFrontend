import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class DeletePasskey extends API {
  constructor(params: { user_id: number }) {
    super("/user/webauthn/passkey", Method.DELETE, params, {});
  }
}
