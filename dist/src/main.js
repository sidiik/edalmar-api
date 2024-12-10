"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const logger_1 = require("../constants/logger");
const dotenv = require("dotenv");
const envFilePath = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
dotenv.config({ path: envFilePath });
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: logger_1.default,
    });
    app.setGlobalPrefix('v1');
    app.use(cookieParser());
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'https://staging.edalmar.com',
            'https://staging-api.edalmar.com',
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
    }));
    await app.listen(8080);
}
bootstrap();
//# sourceMappingURL=main.js.map