import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm"
import {DID} from "./DID";

const es256Meta = {
    kty: 'EC',
    crv: 'P-256'
}

/**
 * ES256 Key Pair
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

    @ManyToOne(() => DID, (did: DID) => did.verificationMethod)
    did: DID

    static get kty() {
        return es256Meta.kty;
    }

    static get crv() {
        return es256Meta.crv;
    }
}
