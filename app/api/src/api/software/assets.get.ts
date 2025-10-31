import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetAssets extends API {
  constructor(params: { page: number; size: number }) {
    super("/software", Method.GET, params, {});
  }
}

export interface GetAssetsResponse {
  list: {
    tags: string
    name: string;
    file_name: string;
    download_url: string;
    created_time: string;
    updated_time: string;
  }[];
  pagination: {
    count: number;
  };
}
