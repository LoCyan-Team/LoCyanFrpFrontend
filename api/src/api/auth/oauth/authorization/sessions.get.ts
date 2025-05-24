import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class GetSessions extends API {
  constructor(params: {
    user_id: number;
    app_id: number;
    page: number;
    size: number;
  }) {
    super("/auth/oauth/authorization/sessions", Method.GET, params, {});
  }
}

export interface GetSessionsResponse {
  list: Array<{
    refresh_token: string;
    authorize_time: string;
  }>;
  pagination: {
    count: number;
  };
}
