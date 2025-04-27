export class Response {
  constructor(
    public status: number,
    public message: string,
    public data: object,
  ) {}
}
