import { API } from "../../type/api";
import { Method } from "../../type/method";

export class DeleteWebAuthn extends API {
  constructor(params: { user_id: number }) {
    super("/user/webauthn", Method.DELETE, params, {});
  }
}
