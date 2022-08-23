import {ExpressErrorMiddlewareInterface, HttpError, Middleware} from 'routing-controllers';
import {Service} from "typedi";
import {NextFunction, Request, Response} from "express";
import {env} from "../env";
import {logger} from "../../logger";

type ErrResponse = {
    message?: string,
    stack?: string
}

type ValidationError = {
    target: object,
    property: string,
    constraints: object
}

/**
 * Global Error Handler
 *
 * @author Yepeng Ding
 */
@Middleware({type: 'after'})
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: Error, request: Request, response: Response, next: NextFunction) {
        const errResponse: ErrResponse = {};

        if (error instanceof HttpError) {
            if ("errors" in error) {
                // Request body validation error
                response.status(400);
                const validationErrors = error["errors"] as ValidationError[]
                errResponse.message = String(Object.values(validationErrors[0].constraints)[0]);
            } else {
                response.status(error.httpCode);
                errResponse.message = "Invalid HTTP request"
            }
        } else {
            if (error.message) {
                errResponse.message = error.message;
            }
            if (error.stack && env.debug) {
                errResponse.stack = error.stack;
            }
        }

        next = () => {
            response.json(errResponse);
            if (env.debug) {
                console.error(error);
            }
            logger.error(error);
        }
        next();
    }
}
