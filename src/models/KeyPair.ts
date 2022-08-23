import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm"
import {DID} from "./DID";


/**
 * ES256 Key Pair
 *
 * @author Yepeng Ding
 */
@Entity()
export class KeyPair {

    @PrimaryColumn()
    kid: string

    @Column()
    x: string

    @Column()
    y: string

    @Column()
    d: string

    @Column()
    spki: string

    @Column()
    pkcs8: string

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

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
