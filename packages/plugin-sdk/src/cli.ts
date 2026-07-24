#!/usr/bin/env node

import { Command } from 'commander';
import { createCommand } from './commands/create.js';
import { buildCommand } from './commands/build.js';
import { packCommand } from './commands/pack.js';

const program = new Command();

program
  .name('croffle-plugin')
  .description('CLI to develop and build plugins for Croffle')
  .version('1.0.0');

program.addCommand(createCommand);
program.addCommand(buildCommand);
program.addCommand(packCommand);

program.parse(process.argv);
