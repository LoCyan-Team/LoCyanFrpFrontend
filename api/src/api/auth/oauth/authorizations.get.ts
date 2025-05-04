import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetAuthorizations extends API {
  constructor(params: { user_id: number }) {
    super("/auth/authorizations", Method.GET, params, {});
  }
}
