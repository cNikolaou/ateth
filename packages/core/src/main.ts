import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  type SchemaRecord,
  type SchemaItem,
} from '@ethereum-attestation-service/eas-sdk';
import { Wallet, JsonRpcSigner } from 'ethers';

const DEFAULT_RESOLVER_ADDRESS = '0x0000000000000000000000000000000000000000';

export async function getSchema(
  signer: Wallet | JsonRpcSigner,
  schemaRegistryContractAddress: string,
  schemaUID: string,
) {
  console.debug('[Function: getSchema] ', signer, schemaRegistryContractAddress, schemaUID);
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
  schemaRegistry.connect(signer);
  const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });
  return schemaRecord;
}

export async function getAttestation(
  signer: Wallet | JsonRpcSigner,
  EASContractAddress: string,
  attestationUID: string,
) {
  console.debug('[Function: getAttestation] ', signer, EASContractAddress, attestationUID);

  const eas = new EAS(EASContractAddress);
  eas.connect(signer);
  const attestation = await eas.getAttestation(attestationUID);
  return attestation;
}

export type SchemaDef = {
  schemaRaw: string;
  resolverAddress?: string;
  revocable?: boolean;
};

export async function registerSchema(
  signer: Wallet | JsonRpcSigner,
  schemaRegistryContractAddress: string,
  schemaDef: SchemaDef,
) {
  console.debug('[Function: registerSchema] ', signer, schemaRegistryContractAddress, schemaDef);

  // TODO: Add validation for schema types

  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
  schemaRegistry.connect(signer);

  const resolverAddress = schemaDef.resolverAddress || DEFAULT_RESOLVER_ADDRESS;
  const revocable = schemaDef.revocable || false;

  const schema = {
    schema: schemaDef.schemaRaw,
    resolverAddress,
    revocable,
  };

  console.debug('[Function: registerSchema] schema', schema);

  const transaction = await schemaRegistry.register(schema);
  const newSchemaUID = await transaction.wait();

  console.debug('[Function: registerSchema] newSchemaUID', newSchemaUID);

  return newSchemaUID;
}

export async function createAttestation(
  signer: Wallet | JsonRpcSigner,
  EASContractAddress: string,
  schema: SchemaRecord,
  recipient: string,
  expirationTime: bigint,
  revocable: boolean,
  data: SchemaItem[],
) {
  console.debug(
    '[Function: createAttestation]',
    signer,
    EASContractAddress,
    schema,
    recipient,
    expirationTime,
    revocable,
    data,
  );
  const eas = new EAS(EASContractAddress);
  eas.connect(signer);

  const schemaEncoder = new SchemaEncoder(schema.schema);
  const encodedData = schemaEncoder.encodeData(data);

  const tx = await eas.attest({
    schema: schema.uid,
    data: {
      recipient,
      expirationTime,
      revocable,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.debug('[Function: createAttestation] newAttestationUID', newAttestationUID);

  return newAttestationUID;
}
