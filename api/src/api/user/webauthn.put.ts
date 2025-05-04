import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PutWebAuthn extends API {
  constructor(params: {
    user_id: string;
    challenge_id: string;
    client_data_json: string;
    attestation_object: string;
  }) {
    super("/user/webauthn", Method.PUT, params, {});
  }
}
