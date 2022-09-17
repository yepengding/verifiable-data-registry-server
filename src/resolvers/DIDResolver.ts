import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {CreateDID} from "../models/dtos/DID.dto";
import {DIDService} from "../services/DIDService";
import {KeyPairService} from "../services/KeyPairService";
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
        private readonly keyPairService: KeyPairService
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

    @Mutation(() => DID, {
        description: 'Create DID',
    })
    async createDID(@Arg('did') did: CreateDID): Promise<DID> {
        const id = this.didService.computeId(did.method, did.methodIdentifier);
        const exist = await this.didService.exists(id);
        Assert.isFalse(exist, `DID (${id}) exists.`);

        // Create authentication key (ES256)
        const {publicKey, privateKey} = await jose.generateKeyPair('ES256');
        const authenticationKeyPair = await this.keyPairService.create(publicKey, privateKey);

        return this.didService.create(did.method, did.methodIdentifier, authenticationKeyPair);
    }

}
