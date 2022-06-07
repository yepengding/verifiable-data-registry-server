import {ExpressErrorMiddlewareInterface, HttpError, Middleware} from 'routing-controllers';
import {Service} from "typedi";
import {NextFunction, Request, Response} from "express";
import {env} from "./env";
import {ValidationError} from "json-schema";
import {logger} from "../logger";

type ErrResponse = {
    name?: string
    message?: string,
    errors?: ValidationError[],
    stack?: string
}

@Middleware({type: 'after'})
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: unknown, request: Request, response: Response, next: NextFunction) {
        const errResponse: ErrResponse = {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        if (error instanceof Error && 'errors' in error) {
            // Validation errors
            response.status(400);
            errResponse.message = "Invalid request body.";
            errResponse.errors = error['errors'] as ValidationError[];
        } else {
            // Other errors
            // Set http status
            if (error instanceof HttpError && error.httpCode) {
                response.status(error.httpCode);
            } else {
                response.status(500);
            }

            if (error instanceof Error) {
                // Set response error fields
                if (error.name && (env.debug || error.message)) {
                    errResponse.name = error.name;
                }
                if (error.message) {
                    errResponse.message = error.message;
                }
                if (error.stack && env.debug) {
                    errResponse.stack = error.stack;
                }
            } else if (typeof error === "string") {
                errResponse.message = error;
            }
        }

        next = () => {
            response.json(errResponse);
            logger.error(error)
        }
        next();
    }
}
