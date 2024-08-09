import * as React from 'react';
import { useState, useEffect } from 'react';

import { useAccount } from 'wagmi';
import { useSchema, useCreateAttestation, useEthersSigner } from '../hooks';
import { contracts } from '../config';

export function AttestationCreate() {
  const { chain, isConnected } = useAccount();
  const [attestationRawData, setAttestationRawData] = useState('');
  const [schemaUID, setSchemaUID] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isRevocable, setIsRevocable] = useState(false);
  const [expirationTime, setExpirationTime] = useState(BigInt(0));

  const schemaRegistryContractAddress = chain ? contracts[chain.id]?.schemaRegistry : undefined;
  const EASContractAddress = chain ? contracts[chain.id]?.eas : undefined;

  const signer = useEthersSigner();
  const {
    schemaRecord,
    error: errorSchema,
    fetchSchema,
  } = useSchema(signer, schemaRegistryContractAddress, schemaUID);

  const {
    attestationUID,
    error: errorAttestation,
    createNewAttestation,
  } = useCreateAttestation(signer, EASContractAddress);

  useEffect(() => {
    if (signer && schemaRegistryContractAddress) {
      console.debug('Fetching schema:', signer, schemaRegistryContractAddress);
      fetchSchema();
    }
  }, [signer, chain, schemaUID]);

  function handleCreate() {
    if (attestationRawData !== '' && schemaRecord && recipientAddress !== '') {
      createNewAttestation(
        schemaRecord,
        recipientAddress,
        expirationTime,
        isRevocable,
        attestationRawData,
      );
    }
  }

  if (!isConnected || !chain) {
    return <div>Waiting to connect to your wallet!</div>;
  }

  return (
    <>
      <h2>Create New Attestation</h2>
      <div>
        <label htmlFor="attestation-data">Attestation Data (as JSON): </label>
        <textarea
          id="attestation-data"
          value={attestationRawData}
          onChange={(e) => setAttestationRawData(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="schema-uid">SchemaUID: </label>
        <input
          type="text"
          id="schema-uid"
          value={schemaUID}
          onChange={(e) => setSchemaUID(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="recipient-address">Recipient address: </label>
        <input
          type="text"
          id="recipient-address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="attestation-expiration">Expiration time: </label>
        <input
          type="text"
          id="attestation-expiration"
          value={recipientAddress}
          onChange={(e) => setExpirationTime(BigInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="attestation-revocable">Is Revocable?: </label>
        <input
          type="checkbox"
          id="attestation-revocable"
          checked={isRevocable}
          onChange={() => setIsRevocable(!isRevocable)}
        />
      </div>
      <button onClick={handleCreate}>Create Attestation</button>
      {errorSchema && <div>Error when receiving schema data: {errorSchema.message}</div>}
      {errorAttestation ? (
        <div>Error when creating attestation {errorAttestation.message}</div>
      ) : (
        <div>AttestationUID: {attestationUID}.</div>
      )}
    </>
  );
}
