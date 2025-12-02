import { API } from "../../../../type/api";
import { Method } from "../../../../type/method";

export class GetImage extends API {
  constructor(params: { user_id: number; domain_id: number }) {
    super("/domain/icp/miit/image", Method.GET, params, {});
  }
}

export interface GetImageResponse {
  client_uid: string;
  token: {
    uuid: string;
    token: string;
  };
  secret_key: string;
  image: {
    big_base64: string;
    small_base64: string;
  };
}
