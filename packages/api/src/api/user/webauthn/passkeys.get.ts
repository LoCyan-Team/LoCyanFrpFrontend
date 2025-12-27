import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetPasskeys extends API {
  constructor(params: { user_id: number }) {
    super("/user/webauthn/passkeys", Method.PUT, params, {});
  }
}

export interface GetPasskeysResponse {
  list: {
    id: number;
    name: string;
    create_time: string;
    last_used: string;
  }[];
}
