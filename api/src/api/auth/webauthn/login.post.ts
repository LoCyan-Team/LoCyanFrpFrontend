import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PostLogin extends API {
  constructor(params: { credential: string }) {
    super("/auth/webauthn/login", Method.POST, params, {});
  }
}
