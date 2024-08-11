import { useState } from 'react';
import { Attestation } from '@ethereum-attestation-service/eas-sdk';
import { Wallet, JsonRpcSigner } from 'ethers';

import { getAttestation } from '@attkit/core';

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
