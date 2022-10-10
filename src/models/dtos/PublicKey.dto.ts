import {createUnionType, Field, ObjectType} from "type-graphql";

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

@ObjectType({description: "Public key (EdDSA)."})
export class EDDSAPublicKey {

    @Field({description: "Key type."})
    kty: string

    @Field()
    x: string

    @Field({description: "Key curve."})
    crv: string

}

/**
 * Public Key DTO type
 */
export type PublicKeyDTOType = ES256PublicKey | EDDSAPublicKey;


/**
 * Public Key DTO type for GraphQL
 */
export const PublicKeyDTO = createUnionType({
    name: "PublicKeyDTO",
    types: () => [ES256PublicKey, EDDSAPublicKey] as const,
    resolveType: value => {
        if ("y" in value) {
            return ES256PublicKey;
        } else {
            return EDDSAPublicKey;
        }
    }
})
