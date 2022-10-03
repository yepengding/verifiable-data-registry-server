import {Arg, Query, Resolver} from 'type-graphql';
import {PublicKeyService} from "../services/PublicKeyService";
import {Assert} from "../common/assertion/Assert";
import {Service} from "typedi";
import {PublicKey} from "../models/entities/PublicKey";

/**
 * Public Key Resolver
 *
 * @author Yepeng Ding
 */
@Service()
@Resolver()
export class PublicKeyResolver {

    constructor(
        private readonly publicKeyService: PublicKeyService
    ) {
    }

    @Query(() => PublicKey, {
        description: 'Resolve Public Key',
    })
    async resolvePublicKey(@Arg('kid') kid: string): Promise<PublicKey | null> {
        const pk = await this.publicKeyService.retrieve(kid);
        Assert.notNull(pk, `Public Key (${kid}) does not exist.`);
        return pk;
    }

}
