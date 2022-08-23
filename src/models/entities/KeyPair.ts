import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm"
import {DID} from "./DID";
import {Field, ObjectType} from "type-graphql";


/**
 * ES256 Key Pair
 *
 * @author Yepeng Ding
 */
@ObjectType()
@Entity()
export class KeyPair {

    @Field()
    @PrimaryColumn()
    kid: string

    @Field()
    @Column()
    x: string

    @Field()
    @Column()
    y: string

    @Field()
    @Column()
    d: string

    @Field()
    @Column()
    spki: string

    @Field()
    @Column()
    pkcs8: string

    @Field()
    @CreateDateColumn()
    createdAt?: Date

    @Field()
    @UpdateDateColumn()
    updatedAt?: Date

    @Field(() => DID)
    @ManyToOne(() => DID, (did: DID) => did.verificationMethod)
    did: DID

    static get kty() {
        return es256Meta.kty;
    }

    static get crv() {
        return es256Meta.crv;
    }
}

const es256Meta = {
    kty: 'EC',
    crv: 'P-256'
}
