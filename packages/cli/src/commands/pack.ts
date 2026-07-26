import path from 'node:path';

import AdmZip from 'adm-zip';
import { Command } from 'commander';
import fs from 'fs-extra';
import picocolors from 'picocolors';

const MANIFEST_FILENAME = 'croffle-manifest.json';

export const packCommand = new Command('pack')
  .description('Package the built extension into a .zip file')
  .action(async () => {
    try {
      const distPath = path.join(process.cwd(), 'dist');
      const manifestPath = path.join(distPath, MANIFEST_FILENAME);

      if (!fs.existsSync(distPath)) {
        console.error(picocolors.red('Error: dist folder not found. Please run "build" first.'));
        process.exit(1);
      }

      if (!fs.existsSync(manifestPath)) {
        console.error(
          picocolors.red(
            `Error: ${MANIFEST_FILENAME} not found in dist/. Please ensure it exists.`,
          ),
        );
        process.exit(1);
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const extensionId = manifest.id;
      if (!extensionId) {
        console.error(picocolors.red(`Error: ${MANIFEST_FILENAME} is missing an "id" field.`));
        process.exit(1);
      }

      const zipFileName = `${extensionId}-${manifest.version || '1.0.0'}.zip`;
      console.log(picocolors.cyan(`Packaging extension as ${zipFileName}...`));

      const zip = new AdmZip();
      zip.addLocalFolder(distPath, extensionId);
      zip.writeZip(zipFileName);

      console.log(picocolors.green(`✔ Successfully packaged extension to ${zipFileName}`));
    } catch (error) {
      console.error(picocolors.red('Failed to pack extension:'), error);
      process.exit(1);
    }
  });
