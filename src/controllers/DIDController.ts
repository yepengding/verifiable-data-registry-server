import {Get, JsonController, Param} from 'routing-controllers';
import {Service} from "typedi";
import {Assert} from "../common/assertion/Assert";
import {DIDService} from "../services/DIDService";
import {DID} from "../models/entities/DID";


/**
 * DID Controller
 *
 * @author Yepeng Ding
 */
@JsonController('/did')
@Service()
export class DIDController {

    constructor(
        private didService: DIDService
    ) {
    }

    /**
     * Get DID Document
     *
     * @param id
     */
    @Get('/:id')
    async getOneById(@Param('id') id: string) {
        const did = await this.didService.retrieve(id);
        Assert.notNull(did, `DID (${id}) does not exist.`);
        return this.didService.resolveDIDToDoc(<DID>did);
    }

}


