import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class PostSign extends API {
  constructor(params: {
    user_id: number;
    client_uid: string;
    secret_key: string;
    token: string;
    token_uuid: string;
    point_json: string;
  }) {
    super("/domain/icp/miit/sign", Method.POST, params, {});
  }
}
