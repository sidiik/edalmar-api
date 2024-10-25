export class ApiResponse<T> {
  result: T;
  message: string;
  statusCode: number;

  constructor(result: T, message?: string, statusCode?: number) {
    this.message = message || 'Operation successful';
    this.statusCode = statusCode || 200;
    this.result = result;
  }
}
