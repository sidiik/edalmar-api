"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const logger = nest_winston_1.WinstonModule.createLogger({
    transports: [
        new winston_1.transports.DailyRotateFile({
            filename: `logs/%DATE%-error.log`,
            level: 'error',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxFiles: '30d',
        }),
        new winston_1.transports.DailyRotateFile({
            filename: `logs/%DATE%-combined.log`,
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxFiles: '30d',
        }),
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.cli(), winston_1.format.splat(), winston_1.format.timestamp(), winston_1.format.printf((info) => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })),
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map