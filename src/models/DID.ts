import {Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn} from "typeorm"
import {KeyPair} from "./KeyPair";

/**
 * Decentralized Identifier
 *
 * @author Yepeng Ding
 */
@Entity()
export class DID {

    @PrimaryColumn()
    id: string

    @Column()
    method: string

    @Column()
    methodIdentifier: string

    @Column()
    authentication: string

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

    @OneToMany(() => KeyPair, (keyPair: KeyPair) => keyPair.did)
    verificationMethod: KeyPair[]

}
