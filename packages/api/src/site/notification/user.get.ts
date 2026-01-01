import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class GetUser extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/site/notification/user", Method.GET, params, {});
  }
}

export interface GetUserResponse {
  list: {
    id: number;
    title: string;
    content: string;
    create_time: string;
    read_time: string | null;
  }[];
  pagination: {
    count: number;
  };
}
