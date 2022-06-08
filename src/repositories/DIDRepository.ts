import AppDataSource from "../db";

import {DID} from '../models/DID';

/**
 * Decentralized Identifier Repository
 */
export const DIDRepository = AppDataSource.getRepository(DID).extend({

});
