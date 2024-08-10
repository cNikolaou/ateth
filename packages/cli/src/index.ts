import { Command } from 'commander';

import { contracts, chainNameToId, getAttestation } from '@ateth/core';

import { hasValidEnvVars, getSigner } from './utils.js';

const program = new Command();

program
  .name('ateth')
  .description('Create and fetch EAS attestations and attestation schemas')
  .version('0.0.1')
  .hook('preAction', () => {
    if (!hasValidEnvVars()) {
      process.exit(1);
    }
  });

program
  .command('get-attestation')
  .option('-n, --network <network>', 'specify the network (e.g. ethereum, sepolia, optimism)')
  .option('-u, --uid <attestationUID>', 'UID of the attestation to fetch')
  .action(async (options) => {
    const signer = await getSigner(options.network);
    const EASContractAddress = contracts[chainNameToId[options.network]]?.eas;

    const attestation = await getAttestation(signer, EASContractAddress, options.uid);

    console.log(attestation);
  })
  .hook('preAction', (thisCommand) => {
    if (!thisCommand.opts().network) {
      console.error('You need to specify the network with "-n, --network <network>"');
      process.exit(1);
    }
    if (!thisCommand.opts().uid) {
      console.error('You need to specify the Attestation UID with "-u, --uid <attestationUID>"');
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
