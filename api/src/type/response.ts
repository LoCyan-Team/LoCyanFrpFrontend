export class Response<T extends object> {
  constructor(
    public status: number,
    public message: string,
    public data: T,
  ) {}
}
