import AppDataSource from "../db";
import {PublicKey} from "../models/entities/PublicKey";

/**
 * Public Key Repository
 *
 * @author Yepeng Ding
 */
export const PublicKeyRepository = AppDataSource.getRepository(PublicKey).extend({});
