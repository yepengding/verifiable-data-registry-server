import {Field, ObjectType} from "type-graphql";

/**
 * ES256 Public Key
 *
 */
@ObjectType()
export class ES256PublicKey {

    @Field()
    kty: string

    @Field()
    x: string

    @Field()
    y: string

    @Field()
    crv: string

}
