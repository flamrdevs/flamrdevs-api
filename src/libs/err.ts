export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const badRequest = (message = "Bad request") => new APIError(400, message);
export const unauthorized = (message = "Unauthorized") => new APIError(401, message);
