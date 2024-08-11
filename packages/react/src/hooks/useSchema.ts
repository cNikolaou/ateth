import { useState } from 'react';
import { SchemaRecord } from '@ethereum-attestation-service/eas-sdk';
import { Wallet, JsonRpcSigner } from 'ethers';

import { getSchema } from '@atkit/core';

export function useSchema(
  signer: Wallet | JsonRpcSigner | undefined,
  schemaRegistryContractAddress: string | undefined,
  schemaUID: string,
) {
  const DEFAULT_SCHEMA_MESSAGE = 'No Schema';

  const [error, setError] = useState<Error | null>(null);
  const [schemaRecord, setSchemaRecord] = useState<SchemaRecord | null>(null);
  const [schema, setSchema] = useState(DEFAULT_SCHEMA_MESSAGE);

  function resetState() {
    setError(null);
    setSchemaRecord(null);
    setSchema(DEFAULT_SCHEMA_MESSAGE);
  }

  async function fetchSchema() {
    console.debug('[Function: fetchSchema]', signer, schemaRegistryContractAddress, schemaUID);
    try {
      resetState();
      if (schemaUID === '') {
        return;
      }

      if (signer && schemaRegistryContractAddress && schemaUID) {
        const record = await getSchema(signer, schemaRegistryContractAddress, schemaUID);
        setSchemaRecord(record);
        setSchema(record.schema);
      }
    } catch (err) {
      resetState();
      setError(
        err instanceof Error ? err : new Error('An error occurred while fetching the schem'),
      );
    }
  }

  return { schemaRecord, schema, error, fetchSchema };
}
