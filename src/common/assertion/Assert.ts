/**
 * Assertion Tool
 *
 * @author Yepeng Ding
 */
export class Assert {
    public static notNull(object: unknown, message: string) {
        if (object === null || object === undefined) {
            throw Error(message);
        }
    }

    public static isNull(object: unknown, message: string) {
        if (object) {
            throw Error(message);
        }
    }

    public static isTrue(expression: boolean, message: string) {
        if (!expression) {
            throw Error(message);
        }
    }

    public static isFalse(expression: boolean, message: string) {
        if (expression) {
            throw Error(message);
        }
    }
}
