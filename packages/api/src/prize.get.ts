import { API } from "../types/api";
import { Method } from "../types/method";

export class GetPrize extends API {
  constructor(params: { user_id: number }) {
    super("/prize", Method.GET, params, {});
  }
}

export interface GetPrizeResponse {
  list: {
    createdTime: string;
    description: string;
    id: number;
    joinedUserId: string;
    openTime: string;
    prizeName: string;
    prizedUserId: string;
    count: number;
  }[];
}
