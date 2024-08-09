import { useState, useEffect } from 'react';

import { useAccount } from 'wagmi';

import { useEthersSigner } from './useEthersSigner';

import { useSchema, contracts } from 'ateth';

export default function SchemaDisplay() {
  const { chain, isConnected } = useAccount();
  const [schemaUID, setSchemaUID] = useState('');
  const [schemaUIDInput, setSchemaUIDInput] = useState('');

  console.debug('Render: chain', chain, 'Render: contracts', contracts);
  const schemaRegistryContractAddress = chain ? contracts[chain.name]?.schemaRegistry : undefined;

  const signer = useEthersSigner();
  const { schema, error, fetchSchema } = useSchema(
    signer,
    schemaRegistryContractAddress,
    schemaUID,
  );

  useEffect(() => {
    if (signer && schemaRegistryContractAddress) {
      console.debug('Fetching schema for:', signer, schemaRegistryContractAddress);
      fetchSchema();
    }
  }, [signer, chain, schemaUID]);

  if (!isConnected || !chain) {
    return <div>Waiting to connect to your wallet!</div>;
  }

  return (
    <>
      <h2>Schema Display</h2>
      <input type="text" id="schema-uid" onChange={(e) => setSchemaUIDInput(e.target.value)} />
      <button onClick={() => setSchemaUID(schemaUIDInput)}>Search Schema</button>
      <br />
      {error ? (
        <div>Error when fetching schema {error.message}</div>
      ) : (
        <label htmlFor="schema-uid">Schema: {schema}</label>
      )}
    </>
  );
}
