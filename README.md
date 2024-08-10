# at-eth: Create EAS attestations

`ateth` is a UI library and a CLI tool for getting Schema and Attestation data
from the chains that [EAS](https://attest.org/) supports, as well as registering
new Schemas and creating Attestations on those chains.

The current monorepo provides the `packages/react` library with React `hooks` and
unstyled `components` to create frontend applications that interact with EAS.
You can find an example React web application under `example/`.

There is also a CLI that you can run with:

```bash
pnpm build
pnpm cli
```