// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class FormValidator {
  static number(value: number | null, message?: string) {
    if (value === null || value === undefined) {
      return new Error(message ?? "请输入");
    }
    return true;
  }
}
