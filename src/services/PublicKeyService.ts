import {Service} from 'typedi';
import {getPublicKeyRepository} from "../repositories/PublicKeyRepository";
import {PublicKey} from "../models/entities/PublicKey";
import * as jose from "jose";
import {KeyLike} from "jose";

/**
 * Public Key Service
 *
 * @author Yepeng Ding
 */
@Service()
export class PublicKeyService {

    public async findAll(): Promise<PublicKey[]> {
        return (await getPublicKeyRepository()).find();
    }

    public async retrieve(kid: string): Promise<PublicKey | null> {
        return (await getPublicKeyRepository()).findOneBy({kid});
    }

    /**
     * Store Public key
     *
     * @param publicKey
     * @param algorithm
     */
    public async create(publicKey: KeyLike, algorithm: string): Promise<PublicKey> {
        const publicJwk = await jose.exportJWK(publicKey);

        const key = new PublicKey();
        key.kid = await jose.calculateJwkThumbprint(publicJwk);
        key.jwk = JSON.stringify(publicJwk);
        key.algorithm = algorithm;

        return (await getPublicKeyRepository()).save(key);
    }

}
