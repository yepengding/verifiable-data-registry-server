import {DataSource} from "typeorm";
import {env} from "./common/env";
import path from "path";
import {logger} from "./logger";

/**
 * Database Configuration
 *
 * @author Yepeng Ding
 */
const AppDataSource = new DataSource({
    type: env.db.type as "mysql" | "postgres" | "mariadb" | "sqlite",
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    entities: [path.join(__dirname + '/models/entities/*.{ts,js}')],
    synchronize: env.db.synchronize,
    logging: env.db.logging,
    logger: env.db.logger as "advanced-console" | "simple-console" | "file" | "debug"
})

/**
 * Get App Data Source
 *
 * @return Promise<DataSource>
 */
export async function getAppDataSource(): Promise<DataSource> {
    if (AppDataSource.isInitialized) {
        return Promise.resolve(AppDataSource);
    } else {
        return AppDataSource.initialize()
            .then((ds) => {
                logger.debug("Initialized database.")
                return ds;
            });
    }
}

