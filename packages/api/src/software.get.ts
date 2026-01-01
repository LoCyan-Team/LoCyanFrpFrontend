import { API } from "../types/api";
import { Method } from "../types/method";

export class GetSoftware extends API {
  constructor(params: { page: number; size: number }) {
    super("/software", Method.GET, params, {});
  }
}

export interface GetSoftwareResponse {
  list: {
    id: number;
    name: string;
    description: string | null;
    tags: { type: string; content: string }[];
  }[];
  pagination: {
    count: number;
  };
}
