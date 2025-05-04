import { API } from "../../type/api";
import { Method } from "../../type/method";

export class PostRegister extends API {
  constructor(params: {
    credential: string;
  }) {
    super("/auth/register", Method.POST, params, {});
  }
}
