import {Service} from 'typedi';
import {DIDRepository} from "../repositories/DIDRepository";
import {DID} from "../models/entities/DID";
import {KeyPair} from "../models/entities/KeyPair";

/**
 * Decentralized Identifier Service
 *
 * @author Yepeng Ding
 */
@Service()
export class DIDService {

    public async findAll(): Promise<DID[]> {
        return await DIDRepository.find({
            relations: {
                verificationMethod: true
            }
        });
    }

    public async retrieve(id: string): Promise<DID | null> {
        return await DIDRepository.findOne({
            where: {id},
            relations: {
                verificationMethod: true
            }
        });
    }

    public async create(method: string, methodIdentifier: string, authenticationKeyPair: KeyPair): Promise<DID> {
        const did: DID = {
            id: this.computeId(method, methodIdentifier),
            authentication: authenticationKeyPair.kid,
            verificationMethod: [authenticationKeyPair],
            method,
            methodIdentifier
        }
        return await DIDRepository.save(did);
    }

    public async exists(id: string): Promise<boolean> {
        return await this.retrieve(id).then(did => did !== null)
    }

    /**
     * Compute DID
     *
     * @param method method
     * @param methodIdentifier method identifier
     */
    public computeId(method: string, methodIdentifier: string): string {
        return `did:${method}:${methodIdentifier}`;
    }

}
