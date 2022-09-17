import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {CreateDIDReq, CreateDIDRes} from "../models/dtos/DID.dto";
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

    @Query(() => [DID], {
        description: 'Get DID list',
    })
    async getDIDs(): Promise<DID[]> {
        return this.didService.findAll();
    }

    @Query(() => DID, {
        description: 'Get DID by id',
    })
    async getDID(@Arg('id') id: string): Promise<DID | null> {
        const didDoc = await this.didService.retrieve(id);
        Assert.notNull(didDoc, `DID (${id}) does not exist.`);
        return didDoc;
    }

    @Mutation(() => CreateDIDRes, {
        description: 'Create DID',
    })
    async createDID(@Arg('did') did: CreateDIDReq): Promise<CreateDIDRes> {
        const id = this.didService.computeId(did.method, did.methodIdentifier);
        const exist = await this.didService.exists(id);
        Assert.isFalse(exist, `DID (${id}) exists.`);

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
