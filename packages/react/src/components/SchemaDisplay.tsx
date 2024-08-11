import * as React from 'react';
import { useState, useEffect } from 'react';

import { useAccount } from 'wagmi';
import { contracts } from '@atkit/core';

import { useSchema, useEthersSigner } from '../hooks';

export function SchemaDisplay() {
  const { chain, isConnected } = useAccount();
  const [schemaUID, setSchemaUID] = useState('');
  const [schemaUIDInput, setSchemaUIDInput] = useState('');

  const schemaRegistryContractAddress = chain ? contracts[chain.id]?.schemaRegistry : undefined;

  const signer = useEthersSigner();
  const { schema, error, fetchSchema } = useSchema(
    signer,
    schemaRegistryContractAddress,
    schemaUID,
  );

  useEffect(() => {
    if (signer && schemaRegistryContractAddress) {
      console.debug('Fetching schema:', signer, schemaRegistryContractAddress);
      fetchSchema();
    }
  }, [signer, chain, schemaUID]);

  if (!isConnected || !chain) {
    return <div>Waiting to connect to your wallet!</div>;
  }

  return (
    <>
      <h2>Display Schema</h2>
      <label htmlFor="schema-uid">SchemaUID: </label>
      <input type="text" id="schema-uid" onChange={(e) => setSchemaUIDInput(e.target.value)} />
      <button onClick={() => setSchemaUID(schemaUIDInput)}>Search Schema</button>
      <br />
      {error ? <div>Error when fetching schema {error.message}</div> : <div>Shema: {schema}</div>}
    </>
  );
}
