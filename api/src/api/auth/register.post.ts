import { API } from "../../type/api";
import { Method } from "../../type/method";

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

export interface PostRegisterData {
  user_id:number
}