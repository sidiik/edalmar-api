export declare class ApiResponse<T> {
    message: string;
    statusCode: number;
    result: T;
    constructor(result: T, message?: string, statusCode?: number);
    static success<T>(result: T, message?: string, statusCode?: number): ApiResponse<T>;
    static failure<T>(result: T, message?: string, statusCode?: number): ApiResponse<T>;
}
