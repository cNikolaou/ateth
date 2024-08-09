import { useState } from 'react';
import { SchemaRecord } from '@ethereum-attestation-service/eas-sdk';
import { Wallet, JsonRpcSigner } from 'ethers';

import { createAttestation } from '@ateth/core';;

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
