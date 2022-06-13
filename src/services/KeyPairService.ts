import {Service} from 'typedi';
import {KeyPairRepository} from "../repositories/KeyPairRepository";
import {KeyPair} from "../models/KeyPair";
import * as jose from "jose";
import {KeyLike} from "jose";

/**
 * ES256 Key Pair Service
 *
 */
@Service()
export class KeyPairService {

    public async findAll(): Promise<KeyPair[]> {
        return await KeyPairRepository.find();
    }

    public async retrieve(kid: string): Promise<KeyPair | null> {
        return await KeyPairRepository.findOneBy({kid});
    }

    public async create(publicKey: KeyLike, privateKey: KeyLike): Promise<KeyPair> {
        const publicJwk = await jose.exportJWK(publicKey)
        const privateJwk = await jose.exportJWK(privateKey)

        const keyPair = new KeyPair();
        keyPair.kid = await jose.calculateJwkThumbprint(publicJwk);
        keyPair.x = publicJwk.x || '';
        keyPair.y = publicJwk.y || '';
        keyPair.d = privateJwk.d || '';

        keyPair.spki = await jose.exportSPKI(publicKey);
        keyPair.pkcs8 = await jose.exportPKCS8(privateKey);

        return await KeyPairRepository.save(keyPair);
    }

}
