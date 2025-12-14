import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetOptions extends API {
  constructor(params: { user: string }) {
    super("/auth/webauthn/options", Method.POST, params, {});
  }
}

export interface GetOptionsResponse {
  options: object;
}
