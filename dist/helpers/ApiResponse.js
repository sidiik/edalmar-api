"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    message;
    statusCode;
    result;
    constructor(result, message, statusCode) {
        this.message = message || 'Operation successful';
        this.statusCode = statusCode || 200;
        this.result = result;
    }
    static success(result, message, statusCode) {
        return new ApiResponse(result, message, statusCode);
    }
    static failure(result, message, statusCode) {
        return new ApiResponse(result, message, statusCode);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map