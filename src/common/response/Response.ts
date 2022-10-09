/**
 * Response Encapsulation
 *
 * @author Yepeng Ding
 */
export class Response<T> {

    private code: number;
    private message: string;
    private data: T | null;

    constructor(code: number, message: string, data: T | null) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static success<T>(data: T): Response<T> {
        return new Response<T>(200, "ok", data);
    }

    public static fail<T>(message: string): Response<T> {
        return new Response<T>(-1, message, null);
    }

}

/**
 * Error Response Encapsulation
 *
 */
export class ErrResponse {
    message?: string;
    stack?: string;
}
