import { app, net, protocol } from 'electron';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { pluginInfoService } from '../plugin-info/service/PluginInfoService';
import { PluginInfo } from 'croffle';

class PluginManager {
  private pluginDir = path.join(app.getPath('userData'), 'plugins');

  constructor() {
    this.registerProtocol();
  }

  private registerProtocol() {
    protocol.handle('plugin', (req) => {
      const url = req.url.replace('plugin://', '');
      const safePath = path.normalize(url).replace(/^(\.\.(\/|\\|$))+/, '');
      const localPath = path.join(this.pluginDir, safePath);

      return net.fetch('file://' + localPath);
    });
  }

  async installFromLocalZip(zipPath: string) {
    const buffer = fs.readFileSync(zipPath);
    const zip = await JSZip.loadAsync(buffer);

    // create temp dir
    const tempDir = path.join(app.getPath('temp'), `croffle-plugin-${Date.now()}`);
    await fs.promises.mkdir(tempDir, { recursive: true });

    const extractPromise: Promise<void>[] = [];

    // extract zip file to temp dir
    zip.forEach((relativePath, zipEntry) => {
      const targetPath = path.join(tempDir, relativePath);

      if (zipEntry.dir) {
        fs.mkdirSync(targetPath, { recursive: true });
      } else {
        const dirname = path.dirname(targetPath);
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true });
        }

        extractPromise.push(
          zipEntry.async('nodebuffer').then((content) => {
            fs.promises.writeFile(targetPath, content);
          })
        );
      }
    });

    // execute unzip
    await Promise.all(extractPromise);

    // find 'repo-main' root directory
    const dirs = fs.readdirSync(tempDir);
    const rootDir =
      dirs.length === 1 && fs.statSync(path.join(tempDir, dirs[0])).isDirectory() ? dirs[0] : '';

    const extractedPluginPath = path.join(tempDir, rootDir);
    const pluginJsonPath = path.join(extractedPluginPath, 'plugin.json');

    if (!fs.existsSync(pluginJsonPath)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      throw new Error('plugin.json not found');
    }

    const manifest: PluginInfo = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf-8'));
    const finalPluginDir = path.join(this.pluginDir, manifest.id);

    if (fs.existsSync(finalPluginDir)) {
      fs.rmSync(finalPluginDir, { recursive: true, force: true });
    }

    fs.renameSync(extractedPluginPath, finalPluginDir);

    fs.rmSync(tempDir, { recursive: true, force: true });

    return await pluginInfoService.installPlugin({
      id: manifest.id,
      name: manifest.name,
      version: manifest.version,
      author: manifest.author,
      description: manifest.description,
      main: manifest.main,
      enabled: true,
    });
  }

  async installFromGitHub(repoUrl: string) {
    // get zip file from github
    const zipUrl = `${repoUrl}/archive/refs/heads/main.zip`;
    // fetch zip file
    const resp = await fetch(zipUrl);
    if (!resp.ok) {
      throw new Error(`Failed to fetch ${zipUrl}`);
    }

    // read zip file
    const buffer = await resp.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);

    // create temp dir
    const tempDir = path.join(app.getPath('temp'), `croffle-plugin-${Date.now()}`);
    await fs.promises.mkdir(tempDir, { recursive: true });

    const extractPromise: Promise<void>[] = [];

    // extract zip file to temp dir
    zip.forEach((relativePath, zipEntry) => {
      const targetPath = path.join(tempDir, relativePath);

      if (zipEntry.dir) {
        fs.mkdirSync(targetPath, { recursive: true });
      } else {
        const dirname = path.dirname(targetPath);
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true });
        }

        extractPromise.push(
          zipEntry.async('nodebuffer').then((content) => {
            fs.promises.writeFile(targetPath, content);
          })
        );
      }
    });

    // execute unzip
    await Promise.all(extractPromise);

    // find 'repo-main' root directory
    const dirs = fs.readdirSync(tempDir);
    const rootDir =
      dirs.length === 1 && fs.statSync(path.join(tempDir, dirs[0])).isDirectory() ? dirs[0] : '';

    const extractedPluginPath = path.join(tempDir, rootDir);
    const pluginJsonPath = path.join(extractedPluginPath, 'plugin.json');

    if (!fs.existsSync(pluginJsonPath)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      throw new Error('plugin.json not found');
    }

    const manifest: PluginInfo = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf-8'));
    const finalPluginDir = path.join(this.pluginDir, manifest.id);

    if (fs.existsSync(finalPluginDir)) {
      fs.rmSync(finalPluginDir, { recursive: true, force: true });
    }

    fs.renameSync(extractedPluginPath, finalPluginDir);

    fs.rmSync(tempDir, { recursive: true, force: true });

    return await pluginInfoService.installPlugin({
      id: manifest.id,
      name: manifest.name,
      version: manifest.version,
      author: manifest.author,
      description: manifest.description,
      main: manifest.main,
      enabled: true,
    });
  }

  async getPlugins() {
    const dbPlugins = await pluginInfoService.getInstalledPlugins();
    const plugins: PluginInfo[] = [];

    for (const dbPlugin of dbPlugins) {
      const pluginPath = path.join(this.pluginDir, dbPlugin.id, 'plugin.json');

      if (fs.existsSync(pluginPath)) {
        const manifest: PluginInfo = JSON.parse(fs.readFileSync(pluginPath, 'utf-8'));
        plugins.push({
          ...manifest,
          enabled: dbPlugin.enabled,
        });
      }
    }
    return plugins;
  }
}

export const pluginManager = new PluginManager();
