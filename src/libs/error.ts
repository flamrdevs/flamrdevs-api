export class API extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const badRequest = (message = "Bad request") => new API(400, message);
export const unauthorized = (message = "Unauthorized") => new API(401, message);
export const notFound = (message = "Not found") => new API(404, message);
export const internalServerError = (message = "Internal server error") => new API(401, message);
