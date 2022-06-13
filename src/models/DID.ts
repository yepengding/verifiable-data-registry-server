import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm"
import {KeyPair} from "./KeyPair";

/**
 * Decentralized Identifier
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

    @OneToMany(() => KeyPair, (keyPair: KeyPair) => keyPair.did)
    verificationMethod: KeyPair[]

}
