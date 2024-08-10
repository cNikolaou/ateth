import { Command } from 'commander';

import { contracts, chainNameToId, getAttestation, getSchema, registerSchema } from '@ateth/core';

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

program
  .command('get-schema')
  .option('-n, --network <network>', 'specify the network (e.g. ethereum, sepolia, optimism)')
  .option('-u, --uid <schemaUID>', 'UID of the schema to fetch')
  .action(async (options) => {
    const signer = await getSigner(options.network);
    const schemaRegistryContractAddress = contracts[chainNameToId[options.network]]?.schemaRegistry;

    const schemaRecord = await getSchema(signer, schemaRegistryContractAddress, options.uid);

    console.log(schemaRecord);
  })
  .hook('preAction', (thisCommand) => {
    if (!thisCommand.opts().network) {
      console.error('You need to specify the network with "-n, --network <network>"');
      process.exit(1);
    }
    if (!thisCommand.opts().uid) {
      console.error('You need to specify the Schema UID with "-u, --uid <schemaUID>"');
      process.exit(1);
    }
  });

program
  .command('register-schema')
  .option('-n, --network <network>', 'specify the network (e.g. ethereum, sepolia, optimism)')
  .option('-s, --schema <schema>', 'schema to be registered')
  .option('-r, --revocable', '[optional] schema will be revocable')
  .option('-a, --resolver-address', '[optional] address of the resolver contract to use')
  .action(async (options) => {
    const signer = await getSigner(options.network);
    const schemaRegistryContractAddress = contracts[chainNameToId[options.network]]?.schemaRegistry;

    console.log(options);

    const schemaUID = await registerSchema(signer, schemaRegistryContractAddress, {
      schemaRaw: options.schema,
      revocable: options.revocable || false,
      ...(options.resolverAddress && { resolverAddress: options.resolverAddress }),
    });

    console.log('UID of the registered schema', schemaUID);
  })
  .hook('preAction', (thisCommand) => {
    if (!thisCommand.opts().network) {
      console.error('You need to specify the network with "-n, --network <network>"');
      process.exit(1);
    }
    if (!thisCommand.opts().schema) {
      console.error('You need to specify the schema to register "-s, --schema <schema>"');
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
