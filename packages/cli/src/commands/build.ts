import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Command } from 'commander';
import fs from 'fs-extra';
import picocolors from 'picocolors';

const __filename = import.meta.filename;
const __dirname = import.meta.dirname;

export const buildCommand = new Command('build')
  .description('Build the plugin using tsup')
  .option('-w, --watch', 'Watch files for changes and rebuild', false)
  .action(async (options) => {
    try {
      console.log(picocolors.cyan('Building plugin...'));
      let command = '';
      if (fs.existsSync('vite.config.ts') || fs.existsSync('vite.config.js')) {
        console.log(picocolors.cyan('Found vite.config.ts, using Vite to build...'));
        command = `npx vite build ${options.watch ? '--watch' : ''}`;
      } else {
        console.log(picocolors.cyan('Using tsup to build...'));
        command = `npx tsup src/index.ts --format esm --clean ${options.watch ? '--watch' : ''}`;
      }

      execSync(command, { stdio: 'inherit' });

      // Also copy plugin.json to dist if exists
      if (fs.existsSync('plugin.json')) {
        fs.copyFileSync('plugin.json', 'dist/plugin.json');
        console.log(picocolors.green('plugin.json copied to dist/'));
      }

      console.log(picocolors.green('✔ Build complete.'));
    } catch (error) {
      console.error(picocolors.red('Failed to build plugin:'), error);
      process.exit(1);
    }
  });
