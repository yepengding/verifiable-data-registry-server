/**
 * Assertion Tool
 *
 * @author Yepeng Ding
 */
import {SystemError} from "../error-handling/SystemError";

export class Assert {
    public static notNull(object: unknown, httpCode: number, message: string) {
        if (object === null || object === undefined) {
            throw new SystemError(httpCode, message);
        }
    }

    public static isNull(object: unknown, httpCode: number, message: string) {
        if (object) {
            throw new SystemError(httpCode, message);
        }
    }

    public static isTrue(expression: boolean, httpCode: number, message: string) {
        if (!expression) {
            throw new SystemError(httpCode, message);
        }
    }

    public static isFalse(expression: boolean, httpCode: number, message: string) {
        if (expression) {
            throw new SystemError(httpCode, message);
        }
    }
}
