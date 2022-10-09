import 'reflect-metadata';

import {createExpressServer, getMetadataArgsStorage, useContainer as routingUseContainer} from 'routing-controllers';
import {Application} from "express";
import {useContainer as classValidatorUseContainer} from 'class-validator';
import {Container} from 'typedi';
import {env} from "./common/env";
import morgan from "morgan";
import {logger, stream} from "./logger";
import {ErrorHandler} from "./common/error-handling/ErrorHandler";
import {buildSchema} from "type-graphql";
import {ApolloServer} from "apollo-server-express";
import {GraphQLError} from "graphql";
import path from "path";
import * as swaggerUi from 'swagger-ui-express';
import {validationMetadatasToSchemas} from "class-validator-jsonschema";
import {routingControllersToSpec} from "routing-controllers-openapi";

/**
 * Application
 *
 * @author Yepeng Ding
 */
export class App {
    private readonly app: Application

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.app = createExpressServer({
            cors: true,
            classTransformer: true,
            controllers: [path.join(__dirname + '/controllers/*.{ts,js}')],
            middlewares: [ErrorHandler],
            defaultErrorHandler: false
        });
        void this.initializeCore();
        void this.initializeSwagger();
    }

    /**
     * Run application
     */
    public run() {
        // Run Apollo server
        void this.runApolloServer();

        // Run HTTP server
        return this.runHttpServer();
    }

    /**
     * Initialize core settings
     * @private
     */
    private initializeCore() {

        // Initialize logging
        this.app.use(morgan(env.log.format, {stream}));

        // Set TypeDI container for routing-controllers and class-validator
        routingUseContainer(Container);
        classValidatorUseContainer(Container, {
            fallback: true,
            fallbackOnErrors: true
        });
    }

    /**
     * Initialize Swagger UI
     * @private
     */
    private initializeSwagger() {
        const storage = getMetadataArgsStorage()
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/',
        })

        const spec = routingControllersToSpec(storage, {}, {
            components: {schemas},
            info: {title: 'Verifiable Data Registry Server API', version: '0.1.3'},
        })
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
    }

    /**
     * Run Apollo server.
     *
     * @private
     */
    private async runApolloServer() {
        // Set and start Apollo server to enable GraphQL
        const schema = await buildSchema({
            container: Container,
            resolvers: [path.join(__dirname, '/resolvers/*.{ts,js}')],
        });

        const apolloServer = new ApolloServer({
            schema,
            csrfPrevention: true,
            debug: env.debug,
            cache: "bounded",
            formatError: (error: GraphQLError) => {
                if (env.debug) {
                    return error;
                }
                logger.error(error);
                return new Error(error.message);
            }
        });

        await apolloServer.start()
        apolloServer.applyMiddleware({app: this.app})
        logger.info(`🚀 Apollo is running at path ${apolloServer.graphqlPath}`);
    }

    /**
     * Run HTTP server.
     *
     * @private
     * @return HTTP server
     */
    private runHttpServer() {
        return this.app.listen(env.app.port, () => {
            logger.info(`🚀 App is running on port ${env.app.port}`);
        });
    }

}
