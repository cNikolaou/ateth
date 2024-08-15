import fs from 'fs';
import path from 'path';
import os from 'os';

import { ethers } from 'ethers';
import Table from 'cli-table3';
import { type SignedOffchainAttestation } from '@ethereum-attestation-service/eas-sdk';

export function hasValidEnvVars() {
  if (!process.env.WALLET_PRIVATE_KEY) {
    console.error('Error: WALLET_PRIVATE_KEY environment variable is not set.');
    console.error(
      "Please set the WALLET_PRIVATE_KEY environment variable with your wallet's private key",
    );
    return false;
  }
  if (!process.env.ALCHEMY_API_KEY) {
    console.error('Error: ALCHEMY_API_KEY environment variable is not set.');
    console.error(
      "Please set the ALCHEMY_API_KEY environment variable with your wallet's private key",
    );
    return false;
  }
  return true;
}

export async function getSigner(network: string) {
  const alchemyProvider = new ethers.AlchemyProvider(network, process.env.ALCHEMY_API_KEY);
  const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY || '', alchemyProvider);
  return signer;
}

export async function saveOffchainAttestation(offchainAttestation: SignedOffchainAttestation) {
  const homeDir = os.homedir();
  const attestationsDir = path.join(homeDir, '.attestations');

  await fs.mkdirSync(attestationsDir, { recursive: true });

  const filePath = path.join(attestationsDir, offchainAttestation.uid);
  const bigIntReplacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);

  const attestationString = JSON.stringify(offchainAttestation, bigIntReplacer, 2);

  await fs.writeFileSync(filePath, attestationString, { encoding: 'utf8' });
  console.log(`Offhchain attestation saved tp ${filePath}`);
}

export async function listAttestations() {
  const homeDir = os.homedir();
  const attestationsDir = path.join(homeDir, '.attestations');

  const table = new Table({
    head: ['AttestationUID', 'SchemaUID', 'Recipient'],
  });

  try {
    const files = await fs.readdirSync(attestationsDir);

    for (const file of files) {
      const filePath = path.join(attestationsDir, file);
      const attestationContent = await fs.readFileSync(filePath, 'utf8');
      const offchainAttestation: SignedOffchainAttestation = JSON.parse(attestationContent);

      table.push([
        offchainAttestation.uid,
        offchainAttestation.message.schema,
        offchainAttestation.message.recipient,
      ]);
    }
  } catch (err) {
    console.error(err);
  }
  console.log(table.toString());
}

export async function showAttestation(uid: string) {
  const homeDir = os.homedir();
  const attestationsDir = path.join(homeDir, '.attestations');

  try {
    const filePath = path.join(attestationsDir, uid);
    const attestationContent = await fs.readFileSync(filePath, 'utf8');

    const bigIntReviver = (key, value) => {
      const bigIntFields = ['chainId', 'expirationTime', 'time'];

      if (bigIntFields.includes(key) && typeof value == 'string') {
        return BigInt(value);
      }
      return value;
    };

    const offchainAttestation: SignedOffchainAttestation = JSON.parse(
      attestationContent,
      bigIntReviver,
    );

    console.log('Attestation Data');
    console.log('----------------');
    console.log(offchainAttestation);
  } catch (err) {
    console.error(err);
  }
}

export async function readOffchainAttestation(uid: string) {
  const homeDir = os.homedir();
  const attestationsDir = path.join(homeDir, '.attestations');

  try {
    const filePath = path.join(attestationsDir, uid);
    const attestationContent = await fs.readFileSync(filePath, 'utf8');

    const bigIntReviver = (key, value) => {
      const bigIntFields = ['chainId', 'expirationTime', 'time'];

      if (bigIntFields.includes(key) && typeof value == 'string') {
        return BigInt(value);
      }
      return value;
    };

    const offchainAttestation: SignedOffchainAttestation = JSON.parse(
      attestationContent,
      bigIntReviver,
    );

    return offchainAttestation;
  } catch (err) {
    console.error('Error while reading offchain attestation:', err);
  }
}
