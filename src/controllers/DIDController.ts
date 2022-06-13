import {Body, Get, JsonController, Param, Post} from 'routing-controllers';
import {DIDService} from "../services/DIDService";
import {Service} from "typedi";
import {IsNotEmpty} from "class-validator";
import {Assert} from "../common/Assert";
import * as jose from 'jose';
import {KeyPairService} from "../services/KeyPairService";

export class CreateDIDBody {
    @IsNotEmpty()
    public method: string;

    @IsNotEmpty()
    public methodIdentifier: string;
}

/**
 * Decentralized Identifier Controller
 *
 * @author Yepeng Ding
 */
@JsonController('/did')
@Service()
export class DIDController {

    constructor(
        private didService: DIDService,
        private keyPairService: KeyPairService
    ) {
    }

    @Get()
    async getAll() {
        return this.didService.findAll();
    }

    @Get('/:id')
    async get(@Param('id') id: string) {
        return this.didService.retrieve(id)
    }

    @Post()
    async create(@Body() body: CreateDIDBody) {
        const id = this.didService.computeId(body.method, body.methodIdentifier);
        const exist = await this.didService.exists(id);
        Assert.isFalse(exist, `DID (${id}) exists.`);
        // Create authentication key (ES256)
        const {publicKey, privateKey} = await jose.generateKeyPair('ES256');
        const authenticationKeyPair = await this.keyPairService.create(publicKey, privateKey);

        return this.didService.create(body.method, body.methodIdentifier, authenticationKeyPair);
    }

}
