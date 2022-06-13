import AppDataSource from "../db";
import {KeyPair} from "../models/KeyPair";

/**
 * ES256 Key Pair Repository
 */
export const KeyPairRepository = AppDataSource.getRepository(KeyPair).extend({

});
