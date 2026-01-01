import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetAssets extends API {
  constructor(params: { software_id: number; page: number; size: number }) {
    super("/software/assets", Method.GET, params, {});
  }
}

export interface GetAssetsResponse {
  list: {
    tag: string;
    name: string;
    file_name: string;
    description: string | null;
    download_urls: {
      name: string;
      url: string;
    }[];
    created_time: string;
    updated_time: string;
  }[];
  pagination: {
    count: number;
  };
}
