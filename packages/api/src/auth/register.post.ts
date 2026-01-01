import { API } from "../../types/api";
import { Method } from "../../types/method";

export class PostRegister extends API {
  constructor(params: {
    username: string;
    password: string;
    email: string;
    verify_code: number;
  }) {
    super("/auth/register", Method.POST, params, {});
  }
}

export interface PostRegisterResponse {
  user_id: number;
}
