import {Body, Get, JsonController, Param, Post} from 'routing-controllers';
import {DIDService} from "../services/DIDService";
import {Service} from "typedi";
import {IsNotEmpty} from "class-validator";
import {Assert} from "../common/Assert";

export class CreateDIDBody {
    @IsNotEmpty()
    public method: string;

    @IsNotEmpty()
    public methodIdentifier: string;
}

/**
 * Decentralized Identifier Controller
 *
 */
@JsonController('/did')
@Service()
export class DIDController {

    constructor(
        private didService: DIDService
    ) {
    }

    @Get()
    getAll() {
        return this.didService.findAll();
    }

    @Get('/:id')
    get(@Param('id') id: string) {
        return this.didService.retrieve(id)
    }

    @Post()
    async create(@Body() body: CreateDIDBody) {
        const id = this.didService.computeId(body.method, body.methodIdentifier);
        const exist = await this.didService.exists(id);
        Assert.isFalse(exist, `DID (${id}) exists.`);
        return this.didService.create({...body, id: ''});
    }

}
