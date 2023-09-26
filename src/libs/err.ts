export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const badRequest = (message = "Bad request") => new APIError(400, message);
