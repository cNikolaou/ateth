# attestation-kit: Tools for EAS attestations

`attestation-kit` (or `attkit`) is a collection of tools accessing and creating
schemas and attestations on the chains where the [EAS](https://attest.org/)
contracts are deployed.

Register schemas, create attestations, and access the stored schemas and
attestations. The repo currently includes the following packages:

### Packages

| Package                      | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| [attkit](packages/react)      | React hooks and unstyled components             |
| [@attkit/core](packages/core) | Core functionality shared across other packages |
| [@attkit/cli](packages/cli)   | Command line interface                          |

## React hooks and unstyled components

`packages/react` is a library with React `hooks` and unstyled `components`
to create frontend applications that interact with EAS.

You can find an example React web application under `example/` that you can
run with `pnppm run dev`.

The library currently depends on [`wagmi`](https://wagmi.sh/) to connect to
your wallet in the browser.

## CLI

To run the CLI from the root directory:

- build the packages with `pnpm build`
- run the CLI with `pnpm cli`

For example to get an attestation based on the Attestation `UID`:

```bash
pnpm cli get-attestation --network sepolia -u 0xbcc99c153218efa499d234598db9ce30d0e9bb8a8ceba557150974e5a2768430
```
