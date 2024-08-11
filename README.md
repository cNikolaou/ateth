# attestation-kit: Tools for EAS attestations

A UI library and a CLI tool for getting Schema and Attestation data
from the chains where the [EAS](https://attest.org/) contracts are deployed,
as well as registering new Schemas and creating Attestations on those chains.

The current monorepo provides the `packages/react` library with React `hooks` and
unstyled `components` to create frontend applications that interact with EAS.
You can find an example React web application under `example/`.

To run the CLI from the root directory:

- build the packages with `pnpm build`
- run the CLI with `pnpm cli`

For example to get an attestation based on the Attestation `UID`:

```bash
pnpm cli get-attestation --network sepolia -u 0xbcc99c153218efa499d234598db9ce30d0e9bb8a8ceba557150974e5a2768430
```
