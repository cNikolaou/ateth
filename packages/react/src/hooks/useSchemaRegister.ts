import { useState } from 'react';
import { Wallet, JsonRpcSigner } from 'ethers';

import { registerSchema, type SchemaDef } from '@ateth/core';

export function useSchemaRegister(
  signer: Wallet | JsonRpcSigner | undefined,
  schemaRegistryContractAddress: string | undefined,
) {
  const DEFAULT_SCHEMA_MESSAGE = 'No Schema';

  const [error, setError] = useState<Error | null>(null);
  const [schemaUID, setSchemaUID] = useState(DEFAULT_SCHEMA_MESSAGE);

  function resetState() {
    setError(null);
    setSchemaUID(DEFAULT_SCHEMA_MESSAGE);
  }

  async function registerNewSchema(schemaDef: SchemaDef) {
    console.debug(
      '[Function: registerNewSchema]',
      signer,
      schemaRegistryContractAddress,
      schemaDef,
    );
    try {
      resetState();
      if (signer && schemaRegistryContractAddress && schemaDef.schemaRaw) {
        const record = await registerSchema(signer, schemaRegistryContractAddress, schemaDef);
        setSchemaUID(record);
      }
    } catch (err) {
      console.log(err);
      resetState();
      setError(
        err instanceof Error ? err : new Error('An error occurred while fetching the schem'),
      );
    }
  }

  return { schemaUID, error, registerNewSchema };
}
