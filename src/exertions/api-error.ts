export default class ApiError extends Error {
  status;

  errors;

  constructor(status:number, message:string, errors:never[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован', []);
  }

  static BadRequest(message: string, errors = []) {
    return new ApiError(400, message, errors);
  }

  static BadValid(message: string, errors = []) {
    return new ApiError(403, message, errors);
  }

  static NotFound() {
    return new ApiError(404, 'Страница не найдена', []);
  }
}