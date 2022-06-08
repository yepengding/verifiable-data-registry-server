import {Column, Entity, PrimaryColumn} from "typeorm"

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

}
