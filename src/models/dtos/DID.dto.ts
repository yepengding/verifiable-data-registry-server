import {DID} from "../entities/DID";
import {Field, InputType, ObjectType} from "type-graphql";
import {IsNotEmpty, MaxLength} from "class-validator";
import {ES256PublicKey} from "./PublicKey.dto";


/**
 * Create DID Request
 *
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
 *
 */
@ObjectType()
export class CreateDIDRes {

    @Field()
    did: string

    @Field()
    authenticationPrivateKey: string

    @Field()
    assertionMethodPrivateKey: string
}

/**
 * Verification Method
 *
 */
@ObjectType()
export class VerificationMethod {
    @Field()
    id: string

    @Field()
    type: string

    @Field()
    controller: string

    @Field(() => ES256PublicKey)
    publicKeyJwk: ES256PublicKey
}

/**
 * DID Document
 *
 */
@ObjectType()
export class DIDDoc {

    @Field(() => [String])
    context: string[]

    @Field()
    id: string

    @Field(() => [String])
    authentication: [string]

    @Field(() => [VerificationMethod])
    verificationMethod: VerificationMethod[]

}

