import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class GetPermissions extends API {
  constructor(params: { user_id: number }) {
    super("/auth/oauth/permissions", Method.GET, params, {});
  }
}

export interface GetPermissionsResponse {
  list: {
    id: number;
    node: string;
    description: string;
  }[];
}
