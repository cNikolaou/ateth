import { useState } from 'react';

import { getAttestation, getSchema, registerSchema } from './core';

/**
 * @typedef {import('@ethereum-attestation-service/eas-sdk').SchemaRecord} SchemaRecord
 * @typedef {import('@ethereum-attestation-service/eas-sdk').Attestation} Attestation
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

/**
 *
 * @param {Wallet} signer
 * @param {string} EASContractAddress
 * @param {string} attestationUID
 * @returns {Promise<Attestation>}
 */
export function useAttestation(signer, EASContractAddress, attestationUID) {
  const [error, setError] = useState(null);
  const [attestation, setAttestation] = useState(null);

  function resetState() {
    setError(null);
    setAttestation(null);
  }

  async function fetchAttestation() {
    console.debug('[Function: fetchAttestation]', signer, EASContractAddress, attestationUID);
    try {
      resetState();
      if (attestationUID === '') {
        return;
      }

      if (signer && EASContractAddress && attestationUID) {
        const attestation = await getAttestation(signer, EASContractAddress, attestationUID);
        setAttestation(attestation);
      }
    } catch (err) {
      resetState();
      setError(
        err instanceof Error ? err : new Error('An error occurred while fetching the attestation'),
      );
    }
  }

  return { attestation, error, fetchAttestation };
}

/**
 *
 * @param {Wallet} signer
 * @param {string} schemaRegistryContractAddress
 * @returns {Promise<SchemaRecord>}
 */
export function useSchemaRegister(signer, schemaRegistryContractAddress) {
  const DEFAULT_SCHEMA_MESSAGE = 'No Schema';

  const [error, setError] = useState(null);
  const [schemaAddress, setSchemaAddress] = useState(DEFAULT_SCHEMA_MESSAGE);

  function resetState() {
    setError(null);
    setSchemaAddress(DEFAULT_SCHEMA_MESSAGE);
  }

  async function createSchema(schemaDef) {
    console.debug('[Function: createSchema]', signer, schemaRegistryContractAddress, schemaDef);
    try {
      resetState();
      if (signer && schemaRegistryContractAddress && schemaDef.schemaRaw) {
        const record = await registerSchema(signer, schemaRegistryContractAddress, schemaDef);
        setSchemaAddress(record);
      }
    } catch (err) {
      console.log(err);
      resetState();
      setError(
        err instanceof Error ? err : new Error('An error occurred while fetching the schem'),
      );
    }
  }

  return { schemaAddress, error, createSchema };
}
