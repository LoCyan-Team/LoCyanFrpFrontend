import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PutWebAuthn extends API {
  constructor(params: { user_id: number; response_json: string }) {
    super("/user/webauthn", Method.PUT, params, {});
  }
}
