import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetPermissions extends API {
  constructor(params: { user_id: number }) {
    super("/auth/oauth/permissions", Method.GET, params, {});
  }
}

export interface GetPermissionsResponse {
  list: Array<{
    id: number;
    node: string;
    description: string;
  }>;
}
