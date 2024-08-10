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
