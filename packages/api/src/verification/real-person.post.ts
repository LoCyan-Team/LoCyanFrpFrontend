import { API } from "../../types/api";
import { Method } from "../../types/method";

export class PostRealPerson extends API {
  constructor(params: {
    user_id: number;
    name: string;
    id_card: string;
    id_type: string;
  }) {
    super("/verification/real-person", Method.POST, params, {});
  }
}

export interface PostRealPersonResponse {
  url: string;
}
