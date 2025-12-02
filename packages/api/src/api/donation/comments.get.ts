import { API } from "../../type/api";
import { Method } from "../../type/method";

export interface GetCommentsResponse {
  list: {
    username: string;
    amount: number;
    message: string;
    time: string;
  }[];
  pagination: {
    count: number;
  };
}

export class GetComments extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/donation/comments", Method.GET, params, {});
  }
}
