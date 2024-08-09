import { useState } from 'react';
import { Attestation, SchemaRecord } from '@ethereum-attestation-service/eas-sdk';
import { Wallet, JsonRpcSigner } from 'ethers';

import {
  getAttestation,
  getSchema,
  registerSchema,
  createAttestation,
  type SchemaDef,
} from './core';

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

export function useAttestation(
  signer: Wallet | JsonRpcSigner | undefined,
  EASContractAddress: string | undefined,
  attestationUID: string,
) {
  const [error, setError] = useState<Error | null>(null);
  const [attestation, setAttestation] = useState<Attestation | null>(null);

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

export function useCreateAttestation(
  signer: Wallet | JsonRpcSigner | undefined,
  EASContractAddress: string | undefined,
) {
  const DEFAULT_ATTESTATION_MESSAGE = 'No Attestation';

  const [error, setError] = useState<Error | null>(null);
  const [attestationUID, setAttestationUID] = useState(DEFAULT_ATTESTATION_MESSAGE);

  function resetState() {
    setError(null);
    setAttestationUID(DEFAULT_ATTESTATION_MESSAGE);
  }

  async function createNewAttestation(
    schema: SchemaRecord,
    recipient: string,
    expirationTime: bigint,
    revocable: boolean,
    attestationRawData: string,
  ) {
    console.debug(
      '[Function: createNewAttestation]',
      signer,
      EASContractAddress,
      schema,
      recipient,
      expirationTime,
      revocable,
      attestationRawData,
    );
    try {
      resetState();
      if (signer && EASContractAddress && schema && recipient && attestationRawData) {
        const record = await createAttestation(
          signer,
          EASContractAddress,
          schema,
          recipient,
          expirationTime,
          revocable,
          JSON.parse(attestationRawData),
        );
        setAttestationUID(record);
      }
    } catch (err) {
      console.log(err);
      resetState();
      setError(
        err instanceof Error ? err : new Error('An error occurred while fetching the schem'),
      );
    }
  }

  return { attestationUID, error, createNewAttestation };
}
