import {Service} from 'typedi';
import {getDIDRepository} from "../repositories/DIDRepository";
import {DID} from "../models/entities/DID";
import {PublicKey} from "../models/entities/PublicKey";
import {DIDDoc} from "../models/dtos/DID.dto";
import {ContextUtil} from "../util/ContextUtil";
import {PublicKeyDTOType} from "../models/dtos/PublicKey.dto";

/**
 * Decentralized Identifier Service
 *
 * @author Yepeng Ding
 */
@Service()
export class DIDService {

    public async findAll(): Promise<DID[]> {
        return (await getDIDRepository()).find({
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
        return (await getDIDRepository()).findOne({
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
     * @param assertionPublicKey
     */
    public async create(method: string, methodIdentifier: string, authenticationKey: PublicKey, assertionPublicKey: PublicKey): Promise<DID> {
        const did: DID = {
            id: this.computeId(method, methodIdentifier),
            authentication: authenticationKey.kid,
            assertionMethod: assertionPublicKey.kid,
            verificationMethod: [authenticationKey, assertionPublicKey],
            method,
            methodIdentifier
        }
        return (await getDIDRepository()).save(did);
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

    /**
     * Resolve DID to DID Document
     *
     * @param did
     */
    public resolveDIDToDoc(did: DID): DIDDoc {
        const didDoc = new DIDDoc();
        didDoc.id = did.id;
        // Only one authentication is supported currently.
        didDoc.authentication = [`${did.id}/${did.authentication}`];

        didDoc.context = ContextUtil.defaultContextOfDID();
        didDoc.context.push(
            ...did.verificationMethod
                // Map to type (Only JWK is supported currently)
                .map(() => "JsonWebKey2020")
                // Filter unique types
                .filter((v, i, a) => a.indexOf(v) === i)
                // Map to contexts
                .map(t => ContextUtil.contextOfKeyType(t))
        );

        // Only JWK is supported
        didDoc.verificationMethod = did.verificationMethod
            .map(m => {
                return {
                    id: `${did.id}/${m.kid}`,
                        type: "JsonWebKey2020",
                    controller: did.id,
                    publicKeyJwk: JSON.parse(m.jwk) as PublicKeyDTOType
                }
            })

        return didDoc;
    }

}
