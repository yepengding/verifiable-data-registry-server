import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {CreateDIDReq, CreateDIDRes, DIDDoc} from "../models/dtos/DID.dto";
import {DIDService} from "../services/DIDService";
import {PublicKeyService} from "../services/PublicKeyService";
import {DID} from "../models/entities/DID";
import {Assert} from "../common/assertion/Assert";
import * as jose from 'jose';
import {Service} from "typedi";
import {HttpErrorCode} from "../common/error-handling/ErroCode";

/**
 * DID Resolver
 *
 * @author Yepeng Ding
 */
@Service()
@Resolver()
export class DIDResolver {

    constructor(
        private readonly didService: DIDService,
        private readonly publicKeyService: PublicKeyService
    ) {
    }

    /**
     * Create DID
     *
     * @param createDidReq
     */
    @Mutation(() => CreateDIDRes, {
        description: 'Create decentralized identifier.',
    })
    async createDID(@Arg('createDidReq', {description: "Decentralized identifier object"}) createDidReq: CreateDIDReq)
        : Promise<CreateDIDRes> {
        const id = this.didService.computeId(createDidReq.method, createDidReq.methodIdentifier);
        Assert.isFalse(await this.didService.exists(id), HttpErrorCode.FORBIDDEN, `DID (${id}) exists.`);

        // Create authentication key (ES256 [P-256])
        const authAlgorithm = 'ES256';
        const authKey = await jose.generateKeyPair(authAlgorithm);
        const authenticationPublicKey = await this.publicKeyService.create(authKey.publicKey, authAlgorithm);

        // Create assertion key (EdDSA [Ed25519])
        const assertAlgorithm = 'EdDSA';
        const assertKey = await jose.generateKeyPair(assertAlgorithm, {crv: "Ed25519"});
        const assertionPublicKey = await this.publicKeyService.create(assertKey.publicKey, assertAlgorithm);

        return {
            did: (await this.didService.create(createDidReq.method, createDidReq.methodIdentifier, authenticationPublicKey, assertionPublicKey)).id,
            authenticationPrivateKey: JSON.stringify(await jose.exportJWK(authKey.privateKey)),
            assertionMethodPrivateKey: JSON.stringify(await jose.exportJWK(assertKey.privateKey))
        };
    }

    @Query(() => DIDDoc, {
        description: 'Resolve DID to DID document.',
    })
    async resolveDIDToDoc(@Arg('id', {description: "Decentralized identifier"}) id: string)
        : Promise<DIDDoc> {
        const did = await this.didService.retrieve(id);
        Assert.notNull(did, HttpErrorCode.FORBIDDEN, `DID (${id}) does not exist.`);
        return this.didService.resolveDIDToDoc(<DID>did);
    }

}
