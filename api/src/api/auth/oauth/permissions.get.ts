import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetPermissions extends API {
  constructor(params: {
    user_id: number;
  }) {
    super("/auth/permissions", Method.GET, params, {});
  }
}
