import {Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn} from "typeorm"
import {KeyPair} from "./KeyPair";
import {Field, ObjectType} from "type-graphql";

/**
 * Decentralized Identifier
 *
 * @author Yepeng Ding
 */
@ObjectType()
@Entity()
export class DID {

    @Field()
    @PrimaryColumn()
    id: string

    @Field()
    @Column()
    method: string

    @Field()
    @Column()
    methodIdentifier: string

    @Field()
    @Column()
    authentication: string

    @Field()
    @CreateDateColumn()
    createdAt?: Date

    @Field()
    @UpdateDateColumn()
    updatedAt?: Date

    @Field(() => [KeyPair])
    @OneToMany(() => KeyPair, (keyPair: KeyPair) => keyPair.did)
    verificationMethod: KeyPair[]

}
