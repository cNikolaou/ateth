import fs from 'fs';
import path from 'path';
import os from 'os';

import { ethers } from 'ethers';

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
