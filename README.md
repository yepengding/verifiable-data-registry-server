# Server-Based Verifiable Data Registry

A server-based implementation of verifiable data registry.
It mainly uses Javascript Object Signing and Encryption (JOSE) for DID and derived functionalities.

## Cryptographic Algorithm

| Functionality      | Algorithm |
|--------------------|-----------|
| DID Authentication | ES256     |

## Quickstart

1. Install dependencies

```shell
yarn install
```

2. Duplicate `.env.example` as `.env` and configure environment variables

3. Build project to `dist`

```shell
yarn build
```

4. Run project

```shell
yarn start
```

## Development

- Run TypeScript compiler in watch mode

```shell
yarn watch
```

- Run dev server

```shell
yarn dev
```

## GraphQL

domain/graphql

---

# References

- [Verifiable Credentials Data Model v1.1](https://www.w3.org/TR/vc-data-model/)
- [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/)
- [Javascript Object Signing and Encryption](https://www.researchgate.net/publication/362015906_Javascript_Object_Signing_and_Encryption_JOSE_Standards_Considerations_and_Applications)
- [swift-express-graphql](https://github.com/yepengding/swift-express-graphql)
- [jose](https://github.com/panva/jose)
