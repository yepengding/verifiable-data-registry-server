import {Query, Resolver} from 'type-graphql';
import {DIDService} from "../services/DIDService";
import {PublicKeyService} from "../services/PublicKeyService";
import {DID} from "../models/entities/DID";
import {Service} from "typedi";
import {PublicKey} from "../models/entities/PublicKey";

/**
 * Admin Resolver
 *
 * @author Yepeng Ding
 */
@Service()
@Resolver()
export class AdminResolver {

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

    @Query(() => [PublicKey], {
        description: 'Get public key list',
    })
    async getPublicKeys(): Promise<PublicKey[]> {
        return this.publicKeyService.findAll();
    }

}
