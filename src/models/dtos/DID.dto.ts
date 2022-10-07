import {DID} from "../entities/DID";
import {Field, InputType, ObjectType} from "type-graphql";
import {IsNotEmpty, MaxLength} from "class-validator";
import {ES256PublicKey} from "./PublicKey.dto";


/**
 * Create DID Request
 *
 */
@InputType({description: "Create DID request."})
export class CreateDIDReq implements Partial<DID> {

    @Field({description: "Method."})
    @IsNotEmpty()
    @MaxLength(55)
    method: string

    @Field({description: "Method identifier."})
    @IsNotEmpty()
    @MaxLength(55)
    methodIdentifier: string

}

/**
 * Create DID Response
 *
 */
@ObjectType({description: "Create DID response."})
export class CreateDIDRes {

    @Field({description: "Decentralized identifier."})
    did: string

    @Field({description: "Private key for DID authentication"})
    authenticationPrivateKey: string

    @Field({description: "Private key for issuing VCs"})
    assertionMethodPrivateKey: string
}

/**
 * Verification Method
 *
 */
@ObjectType({description: "Verification method."})
export class VerificationMethod {
    @Field({description: "Key identifier."})
    id: string

    @Field({description: "Key type."})
    type: string

    @Field({description: "Key controller DID"})
    controller: string

    @Field(() => ES256PublicKey, {description: "Public key in JWK form"})
    publicKeyJwk: ES256PublicKey
}

/**
 * DID Document
 *
 */
@ObjectType({description: "DID document."})
export class DIDDoc {

    @Field(() => [String], {description: "DID contexts."})
    context: string[]

    @Field({description: "Decentralized identifier."})
    id: string

    @Field(() => [String], {description: "Authentication of DID subject."})
    authentication: [string]

    @Field(() => [VerificationMethod], {description: "Verification for issued VCs."})
    verificationMethod: VerificationMethod[]

}

