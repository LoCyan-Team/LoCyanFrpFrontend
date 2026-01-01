import { API } from "../../types/api";
import { Method } from "../../types/method";

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
