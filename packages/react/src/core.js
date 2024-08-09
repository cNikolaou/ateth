import { EAS, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
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

  console.log('[Function: registerSchema] schema', schema);

  const transaction = await schemaRegistry.register(schema);
  const newSchemaAddress = await transaction.wait();

  console.debug('[Function: registerSchema] newSchemaAddress', newSchemaAddress);

  return newSchemaAddress;
}
