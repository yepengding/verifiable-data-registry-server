import {DID} from "../entities/DID";
import {Field, InputType, ObjectType} from "type-graphql";
import {IsNotEmpty, MaxLength} from "class-validator";

/**
 * DID DTOs
 *
 * @author Yepeng Ding
 */

/**
 * Create DID Request
 */
@InputType()
export class CreateDIDReq implements Partial<DID> {

    @Field()
    @IsNotEmpty()
    @MaxLength(55)
    method: string

    @Field()
    @IsNotEmpty()
    @MaxLength(55)
    methodIdentifier: string

}

/**
 * Create DID Response
 */
@ObjectType()
export class CreateDIDRes {

    @Field()
    did: string

    @Field()
    authenticationPrivateKey: string

}
