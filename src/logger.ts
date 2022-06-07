import {existsSync, mkdirSync} from 'fs';
import {join} from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';
import {env} from "./common/env";

const logDir: string = join(__dirname, env.log.dir);

if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

const logFormat = winston.format.printf(({timestamp, level, message}) => `${String(timestamp)} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        // Debug log setting
        new winston.transports.DailyRotateFile({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/debug',
            filename: `%DATE%.log`,
            maxFiles: '30d',
            json: false,
            zippedArchive: true,
        }),
        // Error log setting
        new winston.transports.DailyRotateFile({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error',
            filename: `%DATE%.log`,
            maxFiles: '30d',
            handleExceptions: true,
            json: false,
            zippedArchive: true,
        }),
    ],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
    }),
);

const stream = {
    write: (message: string) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};

export {logger, stream};
