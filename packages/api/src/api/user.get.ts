import { API } from "../type/api";
import { Method } from "../type/method";

export class GetUser extends API {
  constructor(params: { user_id: number }) {
    super("/user", Method.GET, params, {});
  }
}

/**
 * 返回数据
 */
export interface GetUserResponse {
  /**
   * 邮箱
   */
  email: string;
  /**
   * 用户 ID
   */
  id: number;
  /**
   * 限制信息
   */
  limit: {
    /**
     * 上行限速
     */
    inbound: number;
    /**
     * 下行限速
     */
    outbound: number;
    tunnel: number;
  };
  /**
   * 注册时间
   */
  register_time: string;
  /**
   * 剩余流量
   */
  traffic: number;
  /**
   * 用户名
   */
  username: string;
}
