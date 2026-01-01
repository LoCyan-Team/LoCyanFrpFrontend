import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class PutPasskey extends API {
  constructor(params: { user_id: number; response_json: string }) {
    super("/user/webauthn/passkey", Method.PUT, params, {});
  }
}
