import { Command } from 'commander';

import { hasValidEnvVars, getSigner } from './utils';

const program = new Command();

program
  .name('ateth')
  .description('Create and fetch EAS attestations and attestation schemas')
  .version('0.0.1')
  .option('-n, --network <network>', 'specify the network (e.g. ethereum, sepolia, optimism)')
  .hook('preAction', (thisCommand) => {
    if (!hasValidEnvVars()) {
      process.exit(1);
    }
    if (!thisCommand.opts().network) {
      console.error('You need to specify the network with "-n, --network <network>"');
      process.exit(1);
    }
  });

program.command('get-attestation').action(async (options) => {
  const signer = await getSigner(options.network);
  console.log(signer);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
