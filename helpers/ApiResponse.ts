export class ApiResponse<T> {
  message: string;
  statusCode: number;
  result: T;

  constructor(result: T, message?: string, statusCode?: number) {
    this.message = message || 'Operation successful';
    this.statusCode = statusCode || 200;
    this.result = result;
  }

  static success<T>(result: T, message?: string, statusCode?: number) {
    return new ApiResponse(result, message, statusCode);
  }

  static failure<T>(result: T, message?: string, statusCode?: number) {
    return new ApiResponse(result, message, statusCode);
  }
}
