export interface GetSignResponse {
  status: boolean;
  total_sign: number;
  total_get_traffic: number;
  last_sign: string;
}

export interface PostSignResponse {
  get_traffic: number;
  first_sign: boolean;
}