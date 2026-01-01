import { API } from "../types/api";
import { Method } from "../types/method";

export class PostSign extends API {
  constructor(params: { user_id: number }) {
    super("/sign", Method.POST, params, {});
  }
}

export interface PostSignResponse {
  get_traffic: number;
  first_sign: boolean;
}
