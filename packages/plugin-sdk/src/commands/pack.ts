import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import picocolors from 'picocolors';
import AdmZip from 'adm-zip';

export const packCommand = new Command('pack')
  .description('Package the built plugin into a .zip file')
  .action(async () => {
    try {
      const distPath = path.join(process.cwd(), 'dist');
      const pluginJsonPath = path.join(distPath, 'plugin.json');
      
      if (!fs.existsSync(distPath)) {
        console.error(picocolors.red('Error: dist folder not found. Please run "build" first.'));
        process.exit(1);
      }
      
      if (!fs.existsSync(pluginJsonPath)) {
        console.error(picocolors.red('Error: plugin.json not found in dist/. Please ensure plugin.json exists.'));
        process.exit(1);
      }
      
      const manifest = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
      const pluginId = manifest.id;
      if (!pluginId) {
        console.error(picocolors.red('Error: plugin.json is missing an "id" field.'));
        process.exit(1);
      }
      
      const zipFileName = `${pluginId}-${manifest.version || '1.0.0'}.zip`;
      console.log(picocolors.cyan(`Packaging plugin as ${zipFileName}...`));
      
      const zip = new AdmZip();
      
      // Add a root folder inside the zip so it matches the expected structure when unzipped from github
      // PluginManager expects a root dir if unzipped, but actually our local zip install expects a single root directory if there's only one.
      // We will place everything inside a folder named after the plugin ID.
      zip.addLocalFolder(distPath, pluginId);
      
      zip.writeZip(zipFileName);
      
      console.log(picocolors.green(`✔ Successfully packaged plugin to ${zipFileName}`));
    } catch (error) {
      console.error(picocolors.red('Failed to pack plugin:'), error);
      process.exit(1);
    }
  });
