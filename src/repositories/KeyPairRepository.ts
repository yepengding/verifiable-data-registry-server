import AppDataSource from "../db";
import {KeyPair} from "../models/KeyPair";

/**
 * ES256 Key Pair Repository
 *
 * @author Yepeng Ding
 */
export const KeyPairRepository = AppDataSource.getRepository(KeyPair).extend({});
