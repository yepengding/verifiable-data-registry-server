/**
 * System Error
 *
 * @author Yepeng Ding
 */
export class SystemError extends Error {
    private readonly httpCode: number;

    constructor(httpCode: number, message: string) {
        super(message);
        this.httpCode = httpCode;
    }

    public getHttpCode() {
        return this.httpCode;
    }
}
