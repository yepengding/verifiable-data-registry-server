import {getAppDataSource} from "../db";

import {DID} from '../models/entities/DID';

/**
 * Decentralized Identifier Repository
 *
 * @author Yepeng Ding
 */
export const getDIDRepository = async () => {
    const dataSource = await getAppDataSource();
    return dataSource.getRepository(DID).extend({});
}
