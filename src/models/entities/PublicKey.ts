import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm"
import {DID} from "./DID";
import {Field, ObjectType} from "type-graphql";


/**
 * Public Key (JWK)
 *
 * @author Yepeng Ding
 */
@ObjectType()
@Entity()
export class PublicKey {

    @Field()
    @PrimaryColumn()
    kid: string

    @Field()
    @Column()
    jwk: string

    @Field()
    @Column()
    algorithm: string

    @Field()
    @CreateDateColumn()
    createdAt?: Date

    @Field()
    @UpdateDateColumn()
    updatedAt?: Date

    @Field(() => DID)
    @ManyToOne(() => DID, (did: DID) => did.verificationMethod)
    did: DID

}
