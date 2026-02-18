import { app, net, protocol } from 'electron';
import path from 'path';
import fs from 'fs';
// import JSZip from 'jszip';

export class PluginManager {
  private pluginDir = path.join(app.getPath('userData'), 'plugins');

  constructor() {
    this.registerProtocol();
  }

  private registerProtocol() {
    protocol.handle('plugin', (req) => {
      const url = req.url.replace('plugin://', '');
      const [pluginId, ...filePath] = url.split('/');
      const localPath = path.join(this.pluginDir, pluginId, ...filePath);
      return net.fetch('file://' + localPath);
    });
  }

  async installFromGitHub(repoUrl: string) {
    const zipUrl = `${repoUrl}/archive/refs/heads/main.zip`;
    const resp = await fetch(zipUrl, {
      method: 'GET',
    });

    if (!resp.ok) {
      throw new Error(`Failed to fetch ${zipUrl}`);
    }

    // const buffer = await resp.arrayBuffer();
    // const zip = new JSZip();
    // const data = await zip.loadAsync(buffer);
    // TODO: unzip and read the plugin.json
  }

  async getPlugins() {
    const plugins = [];
    for (const plugin of fs.readdirSync(this.pluginDir)) {
      const pluginPath = path.join(this.pluginDir, plugin);
      const pluginJsonPath = path.join(pluginPath, 'plugin.json');
      if (fs.existsSync(pluginJsonPath)) {
        const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf-8'));
        plugins.push({
          id: plugin,
          name: pluginJson.name,
          version: pluginJson.version,
          description: pluginJson.description,
        });
      }
    }
    return plugins;
  }
}
