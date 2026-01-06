import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetSearch extends API {
  constructor(params: {
    user_id: number;
    keyword: string;
    page: number;
    size: number;
  }) {
    super("/nodes/search", Method.GET, params, {});
  }
}

export interface GetSearchResponse {
  list: {
    name: string;
    id: number;
    host: string;
    ip: string | null;
    description: string | null;
    server_port: number;
    port_range: string[];
    additional: {
      allow_big_traffic: boolean;
      allow_udp: boolean;
      allow_http: boolean;
      need_icp: boolean;
    };
    verification_level: string;
  }[];
  pagination: {
    count: number;
  };
}
