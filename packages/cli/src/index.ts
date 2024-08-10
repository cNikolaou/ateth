import { Command } from 'commander';

const program = new Command();

program
  .name('ateth')
  .description('Create and fetch EAS attestations and attestation schemas')
  .version('0.0.1');

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
