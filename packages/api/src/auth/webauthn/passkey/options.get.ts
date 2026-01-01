import { API } from "../../../../types/api";
import { Method } from "../../../../types/method";

export class GetOptions extends API {
  constructor(params: { user: string }) {
    super("/auth/webauthn/passkey/options", Method.POST, params, {});
  }
}

export interface GetOptionsResponse {
  options: object;
}
