/**
 * Key-related test cases
 *
 * @author Yepeng Ding
 */
import {expect} from "chai";
import * as jose from "jose";

describe('Key tests', () => {
    it('should create JWK for assertion', async () => {
        const assertAlgorithm = 'EdDSA';

        // Generate keys
        const {publicKey, privateKey} = await jose.generateKeyPair(assertAlgorithm, {crv: "Ed25519"});

        // Stringify keys
        const pkJwk = await jose.exportJWK(publicKey);
        const pkJwkStr = JSON.stringify(pkJwk);
        const skJwkStr = JSON.stringify(await jose.exportJWK(privateKey));

        // Calculate kid
        const kid = await jose.calculateJwkThumbprint(pkJwk);

        expect(pkJwkStr).to.be.a("string");
        expect(skJwkStr).to.be.a("string");
        expect(kid).to.be.a("string");

        console.log(kid);
        console.log(pkJwkStr);
        console.log(skJwkStr);

    });

    it('should sign and verify string', async () => {
        const text = "Hello, world";

        const algorithm = 'EdDSA';

        // Generate keys
        const {publicKey, privateKey} = await jose.generateKeyPair(algorithm, {crv: "Ed25519"});

        // Stringify keys
        const pkJwkStr = JSON.stringify(await jose.exportJWK(publicKey));
        const skJwkStr = JSON.stringify(await jose.exportJWK(privateKey));

        // Import keys
        const iPk = await jose.importJWK(JSON.parse(pkJwkStr), algorithm);
        const iSk = await jose.importJWK(JSON.parse(skJwkStr), algorithm);

        const jws = await new jose.CompactSign(
            new TextEncoder().encode(text),
        )
            .setProtectedHeader({alg: algorithm})
            .sign(iSk);

        const {payload} = await jose.compactVerify(jws, iPk);

        expect(text).equal(new TextDecoder().decode(payload));
    });

})
