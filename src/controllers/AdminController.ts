import {Get, JsonController} from 'routing-controllers';
import {Service} from "typedi";
import {DIDService} from "../services/DIDService";
import {PublicKeyService} from "../services/PublicKeyService";


/**
 * Admin Controller
 *
 * @author Yepeng Ding
 */
@JsonController('/admin')
@Service()
export class AdminController {

    constructor(
        private readonly didService: DIDService,
        private readonly keyService: PublicKeyService
    ) {
    }

    /**
     * Get all DID documents
     *
     */
    @Get('/all/did')
    async getAllDIDs() {
        return this.didService.findAll();
    }

    /**
     * Get all public keys
     *
     */
    @Get('/all/key')
    async getAllPublicKeys() {
        return this.keyService.findAll();
    }

}


