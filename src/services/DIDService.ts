import {Service} from 'typedi';
import {DIDRepository} from "../repositories/DIDRepository";
import {DID} from "../models/entities/DID";
import {PublicKey} from "../models/entities/PublicKey";

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

    /**
     * Retrieve DID
     *
     * @param id
     */
    public async retrieve(id: string): Promise<DID | null> {
        return await DIDRepository.findOne({
            where: {id},
            relations: {
                verificationMethod: true
            }
        });
    }

    /**
     * Create DID
     *
     * @param method
     * @param methodIdentifier
     * @param authenticationKey
     */
    public async create(method: string, methodIdentifier: string, authenticationKey: PublicKey): Promise<DID> {
        const did: DID = {
            id: this.computeId(method, methodIdentifier),
            authentication: authenticationKey.kid,
            verificationMethod: [authenticationKey],
            method,
            methodIdentifier
        }
        return await DIDRepository.save(did);
    }

    /**
     * Check the existence of DID
     *
     * @param id
     */
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
