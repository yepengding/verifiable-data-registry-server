import {Service} from 'typedi';
import {DIDRepository} from "../repositories/DIDRepository";
import {DID} from "../models/DID";
import {KeyPair} from "../models/KeyPair";

/**
 * Decentralized Identifier Service
 *
 */
@Service()
export class DIDService {

    public async findAll(): Promise<DID[]> {
        return await DIDRepository.find();
    }

    public async retrieve(id: string): Promise<DID | null> {
        return await DIDRepository.findOneBy({id});
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

    public computeId(method: string, methodIdentifier: string): string {
        return `did:${method}:${methodIdentifier}`;
    }

}
