import {Get, JsonController, Param} from 'routing-controllers';
import {Service} from "typedi";
import {Assert} from "../common/assertion/Assert";
import {DIDService} from "../services/DIDService";
import {DID} from "../models/entities/DID";
import {HttpErrorCode} from "../common/error-handling/ErroCode";


/**
 * DID Controller
 *
 * @author Yepeng Ding
 */
@JsonController('/did')
@Service()
export class DIDController {

    constructor(
        private readonly didService: DIDService
    ) {
    }

    /**
     * Get DID Document
     *
     * @param id decentralized identifier
     */
    @Get('/:id')
    async getById(@Param('id') id: string) {
        const did = await this.didService.retrieve(id);
        Assert.notNull(did, HttpErrorCode.NOT_FOUND, `DID (${id}) does not exist.`);
        return this.didService.resolveDIDToDoc(<DID>did);
    }

}


