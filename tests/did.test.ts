import {App} from "../src/app";
import request from "supertest";
import * as http from "http";
import * as process from "process";

describe('DID GraphQL tests', () => {

    let server: http.Server;
    const serverAddress = "http://localhost:8000";

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
                `mutation Mutation($did: CreateDIDReq!) {
                      createDID(did: $did) {
                        did
                        authenticationPrivateKey
                        assertionMethodPrivateKey
                      }
                }`,
            variables: `{
                          "did": {
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
            query: `query ResolveDID($resolveDidId: String!) {
                      resolveDID(id: $resolveDidId) {
                        id
                        authentication
                        context
                        verificationMethod {
                          id
                          type
                          controller
                          publicKeyJwk {
                            kty
                            x
                            y
                            crv
                          }
                        }
                      }
                    }`,
            variables: `{
                          "resolveDidId": "${did}"
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
