import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetAssets extends API {
  constructor(params: { id: number ; page: number; size: number }) {
    super("/software/assets", Method.GET, params, {});
  }
}

export interface GetAssetsResponse {
  list: {
    tag: string
    name: string;
    file_name: string;
    description: string | null;
    download_url: string;
    created_time: string;
    updated_time: string;
  }[];
  pagination: {
    count: number;
  };
}
