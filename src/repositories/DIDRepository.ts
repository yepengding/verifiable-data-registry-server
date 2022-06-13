import AppDataSource from "../db";

import {DID} from '../models/DID';

/**
 * Decentralized Identifier Repository
 *
 * @author Yepeng Ding
 */
export const DIDRepository = AppDataSource.getRepository(DID).extend({});
