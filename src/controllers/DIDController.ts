import {Body, Get, JsonController, Param, Post} from 'routing-controllers';
import {DIDService} from "../services/DIDService";
import {Service} from "typedi";
import {Assert} from "../common/assertion/Assert";
import * as jose from 'jose';
import {KeyPairService} from "../services/KeyPairService";
import {CreateDIDBody} from "../models/vo/req/DIDController";
import {Response} from "../common/response/Response";


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
        const didDoc = await this.didService.retrieve(id);
        Assert.notNull(didDoc, `DID (${id}) does not exist.`);
        return Response.success(didDoc);
    }

    @Post()
    async create(@Body() body: CreateDIDBody) {
        const id = this.didService.computeId(body.method, body.methodIdentifier);
        const exist = await this.didService.exists(id);
        Assert.isFalse(exist, `DID (${id}) exists.`);
        // Create authentication key (ES256)
        const {publicKey, privateKey} = await jose.generateKeyPair('ES256');
        const authenticationKeyPair = await this.keyPairService.create(publicKey, privateKey);

        const created = this.didService.create(body.method, body.methodIdentifier, authenticationKeyPair);

        return Response.success(created);
    }

}
