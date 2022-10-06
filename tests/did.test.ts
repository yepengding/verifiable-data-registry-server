import {App} from "../src/app";
import request from "supertest";
import * as http from "http";
import * as process from "process";

describe('DID GraphQL tests', () => {

    let server: http.Server;

    before(() => {
        const app = new App();
        server = app.run();
    })

    after(() => {
        process.exit(0);
    })

    it('Create DID', async () => {
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

        await request("http://localhost:8000/graphql")
            .post("/")
            .send(mutationData)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => console.log(res.text));
    });

    it('Resolve DID', async () => {
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
                          "resolveDidId": "did:test:0001"
                        }`
        };

        await request("http://localhost:8000/graphql")
            .post("/")
            .send(queryData)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => console.log(res.text));
    });


});