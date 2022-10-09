import {Get, JsonController, Param} from 'routing-controllers';
import {Service} from "typedi";
import {Assert} from "../common/assertion/Assert";
import {DIDService} from "../services/DIDService";
import {HttpErrorCode} from "../common/error-handling/ErroCode";


/**
 * Public Key Controller
 *
 * @author Yepeng Ding
 */
@JsonController('/key')
@Service()
export class PublicKeyController {

    constructor(
        private readonly didService: DIDService,
    ) {
    }

    /**
     * Get public key information
     *
     * @param did decentralized identifier
     * @param kid key identifier
     */
    @Get('/:did/:kid')
    async getByDIDAndKID(@Param('did') did: string, @Param('kid') kid: string) {
        const didEntity = await this.didService.retrieve(did);
        Assert.notNull(did, HttpErrorCode.NOT_FOUND, `DID (${did}) does not exist.`);

        const pk = didEntity?.verificationMethod.find((vm => vm.kid === kid));
        Assert.notNull(pk, HttpErrorCode.NOT_FOUND, `Key (${kid}) does not exist.`);

        return pk;
    }

}


