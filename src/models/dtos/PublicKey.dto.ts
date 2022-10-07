import {Field, ObjectType} from "type-graphql";

/**
 * ES256 Public Key
 *
 */
@ObjectType({description: "Public key (ES256)."})
export class ES256PublicKey {

    @Field({description: "Key type."})
    kty: string

    @Field()
    x: string

    @Field()
    y: string

    @Field({description: "Key curve."})
    crv: string

}
