import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PutPasskey extends API {
  constructor(params: { user_id: number; response_json: string }) {
    super("/user/webauthn/passkey", Method.PUT, params, {});
  }
}
