import dotenv from "dotenv";

dotenv.config();


export const env = {
    port: process.env.PORT || 8000,
    loggingFormat: process.env.LOGGING_FORMAT || 'common'
}
