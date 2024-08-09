import { EAS, SchemaEncoder, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { DEFAULT_RESOLVER_ADDRESS } from './config';

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
export async function getSchema(signer, schemaRegistryContractAddress, schemaUID) {
  console.debug('[Function: getSchema] ', signer, schemaRegistryContractAddress, schemaUID);
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
  schemaRegistry.connect(signer);
  const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });
  return schemaRecord;
}

/**
 *
 * @param {Wallet} signer
 * @param {string} EASContractAddress
 * @param {string} attestationUID
 * @returns {Promise<Attestation>}
 */
export async function getAttestation(signer, EASContractAddress, attestationUID) {
  console.debug('[Function: getAttestation] ', signer, EASContractAddress, attestationUID);

  const eas = new EAS(EASContractAddress);
  eas.connect(signer);
  const attestation = await eas.getAttestation(attestationUID);
  return attestation;
}

/**
 * @typedef {Object} SchemaDef
 * @property {string} schemaRaw
 * @property {string} [resolverAddress]
 * @property {boolean} [revocable]
 */

/**
 *
 * @param {Wallet} signer
 * @param {string} schemaRegistryContractAddress
 * @param {SchemaDef} schemaDef
 * @returns {Promise<string>}
 */
export async function registerSchema(signer, schemaRegistryContractAddress, schemaDef) {
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

/**
 * @typedef {Object} AttestationData
 * @property {string} name
 * @property {string} value
 * @property {boolean} fieldType
 */

/**
 *
 * @param {Wallet} signer
 * @param {string} EASContractAddress
 * @param {SchemaRecord} schema
 * @param {string} recipient
 * @param {number} expirationTime
 * @param {boolean} revocable
 * @param {AttestationData[]} data
 */
export async function createAttestation(
  signer,
  EASContractAddress,
  schema,
  recipient,
  expirationTime,
  revocable,
  data,
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
