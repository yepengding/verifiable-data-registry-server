import {getAppDataSource} from "../db";
import {PublicKey} from "../models/entities/PublicKey";

/**
 * Public Key Repository
 *
 * @author Yepeng Ding
 */
export const getPublicKeyRepository = async () => {
    const dataSource = await getAppDataSource();
    return dataSource.getRepository(PublicKey).extend({});
}
