"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiException = void 0;
const common_1 = require("@nestjs/common");
class ApiException extends common_1.HttpException {
    constructor(response = 'Something went wrong, Please contact support.', status = 500) {
        super(response, status);
    }
}
exports.ApiException = ApiException;
//# sourceMappingURL=ApiException.js.map