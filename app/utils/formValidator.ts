// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class FormValidator {
  static readonly regex = {
    username: /^(?=.{1,24}$)[\w\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff-]+$/,
    email:
      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    tunnel: {
      ip: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      domain:
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      name: /^(?=.{1,24}$)[\w\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff-]+$/,
    },
  };

  static number(value: number | null, message?: string) {
    if (value === null || value === undefined) {
      return new Error(message ?? "请输入");
    }
    return true;
  }
}
