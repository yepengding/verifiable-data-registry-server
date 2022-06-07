import {DataSource} from "typeorm";
import {env} from "./common/env";
import path from "path";

const AppDataSource = new DataSource({
    type: env.db.type as "mysql" | "postgres" | "mariadb" | "sqlite",
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    entities: [path.join(__dirname + '/models/*.js')],
    synchronize: env.db.synchronize,
    logging: env.db.logging,
    logger: env.db.logger as "advanced-console" | "simple-console" | "file" | "debug"
})

AppDataSource.initialize()
    .then(() => {
        console.log("Initialized database.")
    })
    .catch((error) => console.log(error))

export default AppDataSource;
