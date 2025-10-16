import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetAuthorizations extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/auth/oauth/authorizations", Method.GET, params, {});
  }
}

export interface GetAuthorizationsResponse {
  list: {
    app_id: number;
    app_name: string;
    app_description: string;
    authorized_permissions: number[];
  }[];
  pagination: {
    count: number;
  };
}
