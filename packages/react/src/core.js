import { EAS, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';

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
