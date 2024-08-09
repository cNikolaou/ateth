import { useState, useEffect } from 'react';

import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useAttestation, contracts } from 'ateth';

import { useEthersSigner } from './useEthersSigner';

export default function AttestationDisplay() {
  const { chain, isConnected } = useAccount();
  const [attestationUID, setAttestationUID] = useState('');
  const [attestationUIDInput, setAttestationUIDInput] = useState('');

  console.debug('Render: chain', chain, 'Render: contracts', contracts);
  const EASContractAddress = chain ? contracts[chain.name]?.eas : undefined;

  const signer = useEthersSigner();
  const { attestation, error, fetchAttestation } = useAttestation(
    signer,
    EASContractAddress,
    attestationUID,
  );

  useEffect(() => {
    if (signer && EASContractAddress) {
      console.debug('Fetching attestation:', signer, EASContractAddress);
      fetchAttestation();
    }
  }, [signer, chain, attestationUID]);

  if (!isConnected || !chain) {
    return <div>Waiting to connect to your wallet!</div>;
  }

  return (
    <>
      <h2>Attestation Display</h2>
      <label htmlFor="attestation-uid">AttestationUID:</label>
      <input
        type="text"
        id="attestation-uid"
        onChange={(e) => setAttestationUIDInput(e.target.value)}
      />
      <button onClick={() => setAttestationUID(attestationUIDInput)}>Search Attestation</button>
      <br />
      <div>Attestation Data</div>
      {error ? (
        <div>Error when fetching attestation {error.message}</div>
      ) : attestation ? (
        <ul>
          <li>Attester: {attestation.attester}</li>
          <li>Recipient: {attestation.recipient}</li>
          <li>Revocable: {attestation.revocable ? 'Yes' : 'No'}</li>
          <li>Creation Time: {attestation.time}</li>
          <li>Expiration Time: {attestation.expirationTime}</li>
        </ul>
      ) : (
        <div>No data</div>
      )}
    </>
  );
}
