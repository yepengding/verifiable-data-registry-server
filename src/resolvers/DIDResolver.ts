import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {CreateDIDReq, CreateDIDRes, DIDDoc} from "../models/dtos/DID.dto";
import {DIDService} from "../services/DIDService";
import {PublicKeyService} from "../services/PublicKeyService";
import {DID} from "../models/entities/DID";
import {Assert} from "../common/assertion/Assert";
import * as jose from 'jose';
import {Service} from "typedi";

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

    @Query(() => DIDDoc, {
        description: 'Resolve DID',
    })
    async resolveDID(@Arg('id') id: string): Promise<DIDDoc> {
        const did = await this.didService.retrieve(id);
        Assert.notNull(did, `DID (${id}) does not exist.`);
        return this.didService.resolveDIDToDoc(<DID>did);
    }

    @Mutation(() => CreateDIDRes, {
        description: 'Create DID',
    })
    async createDID(@Arg('did') did: CreateDIDReq): Promise<CreateDIDRes> {
        const id = this.didService.computeId(did.method, did.methodIdentifier);
        Assert.isFalse(await this.didService.exists(id), `DID (${id}) exists.`);

        // Create authentication key (ES256)
        const algorithm = 'ES256';
        const {publicKey, privateKey} = await jose.generateKeyPair(algorithm);
        const authenticationPublicKey = await this.publicKeyService.create(publicKey, algorithm);

        return {
            did: (await this.didService.create(did.method, did.methodIdentifier, authenticationPublicKey)).id,
            authenticationPrivateKey: JSON.stringify(await jose.exportJWK(privateKey))
        };
    }

}
