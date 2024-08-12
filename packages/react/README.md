# attkit

React hooks and components for building frontend applications that

### React hooks

Main hooks:

* `useAttestation`: read attestation data from the blockchain and track state of  the request
* `useCreateAttestation`: create attestation based on the arguments passed to the `createNewAttestation()` function that is returned by the hook
* `useSchema`: read schema data from the blockchain
* `useSchemaRegister`: register a new schema based on the schema definition arguments passed to the `registerNewSchema()` function that is returned by the hook

The library uses `wagmi` which does not provide an `ethers.js` provider and
signer, so there are two hooks that you can use to get a provider or a signer
based on this [wagmi docs](https://wagmi.sh/react/guides/ethers) process:

* `useEthersProvider`: get an `ethers.JsonRpcProvider`
* `useEthersProvider`: read attestation data from the blockchain

### React components

* `AttestationCreate`: fields and state for creating new attestations for a specific Schema
* `AttestationDisplay`: fetch and display attestation data for a specific `AttestationUID`
* `SchemaCreate`: fetch and display schema data for a specific `SchemaUID`
* `SchemaRegister`: fields and state for registering new schemas