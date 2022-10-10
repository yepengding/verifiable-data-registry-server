/**
 * DID-related test cases
 *
 * @author Yepeng Ding
 */
import {App} from "../src/app";
import request from "supertest";
import * as http from "http";
import * as process from "process";
import {env} from "../src/common/env";

describe('DID GraphQL tests', () => {

    let server: http.Server;
    const serverAddress = env.app.endpoint;

    before(() => {
        const app = new App();
        server = app.run();
    })

    after(() => {
        server.close();
        process.exit(0);
    })

    it('should create DID', async () => {
        const method = "test";
        const methodIdentifier = "0001";

        const mutationData = {
            query:
                `mutation CreateDID($createDidReq: CreateDIDReq!) {
                    createDID(createDidReq: $createDidReq) {
                        did
                        authenticationPrivateKey
                        assertionMethodPrivateKey
                    }
                }`,
            variables: `{
                          "createDidReq": {
                            "method": "${method}",
                            "methodIdentifier": "${methodIdentifier}"
                          }
                        }`
        };

        await request(`${serverAddress}/graphql`)
            .post("/")
            .send(mutationData)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => console.log(res.body));
    });

    it('should resolve DID', async () => {
        const did = "did:test:0001";

        const queryData = {
            query: `query Query($resolveDidToDocId: String!) {
                        resolveDIDToDoc(id: $resolveDidToDocId) {
                            id
                            authentication
                            context
                            verificationMethod {
                              id
                              type
                              controller
                              publicKeyJwk {
                                ... on ES256PublicKey {
                                  kty
                                  x
                                  y
                                  crv
                                }
                                ... on EDDSAPublicKey {
                                  kty
                                  x
                                  crv
                                }
                              }
                            }
                      }
                    }`,
            variables: `{
                          "resolveDidToDocId": "${did}"
                        }`
        };

        await request(`${serverAddress}/graphql`)
            .post("/")
            .send(queryData)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => console.log(res.body));
    });


});
