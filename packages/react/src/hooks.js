import { useState } from 'react';

import { getSchema } from './core';

/**
 * @typedef {import('@ethereum-attestation-service/eas-sdk').SchemaRecord} SchemaRecord
 * @typedef {import('ethers').Wallet} Wallet
 */

/**
 *
 * @param {Wallet} signer
 * @param {string} schemaRegistryContractAddress
 * @param {string} schemaUID
 * @returns {Promise<SchemaRecord>}
 */
export function useSchema(signer, schemaRegistryContractAddress, schemaUID) {
  const DEFAULT_SCHEMA_MESSAGE = 'No Schema';

  const [error, setError] = useState(null);
  const [schemaRecord, setSchemaRecord] = useState(null);
  const [schema, setSchema] = useState(DEFAULT_SCHEMA_MESSAGE);

  function resetState() {
    setError(null);
    setSchemaRecord(null);
    setSchema(DEFAULT_SCHEMA_MESSAGE);
  }

  async function fetchSchema() {
    console.debug('[Function: fetchSchema]', signer, schemaRegistryContractAddress, schemaUID);
    try {
      console.log('[Function: fetchSchema]', schemaUID == '');
      if (schemaUID === '') {
        resetState();
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
