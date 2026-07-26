import { execSync } from 'node:child_process';

import { Command } from 'commander';
import fs from 'fs-extra';
import picocolors from 'picocolors';

export const buildCommand = new Command('build')
  .description('Build the extension using Vite or tsup')
  .option('-w, --watch', 'Watch files for changes and rebuild', false)
  .action(async (options) => {
    try {
      console.log(picocolors.cyan('Building extension...'));
      let command = '';
      if (fs.existsSync('vite.config.ts') || fs.existsSync('vite.config.js')) {
        console.log(picocolors.cyan('Found vite.config.ts, using Vite to build...'));
        command = `npx vite build ${options.watch ? '--watch' : ''}`;
      } else {
        console.log(picocolors.cyan('Using tsup to build...'));
        command = `npx tsup src/index.ts --format esm --clean ${options.watch ? '--watch' : ''}`;
      }

      execSync(command, { stdio: 'inherit' });

      if (fs.existsSync('croffle-manifest.json')) {
        fs.copyFileSync('croffle-manifest.json', 'dist/croffle-manifest.json');
        console.log(picocolors.green('croffle-manifest.json copied to dist/'));
      }

      console.log(picocolors.green('✔ Build complete.'));
    } catch (error) {
      console.error(picocolors.red('Failed to build extension:'), error);
      process.exit(1);
    }
  });
