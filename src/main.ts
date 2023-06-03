import { Plugin } from 'obsidian';
import axios from 'axios';
import KetcherSmilesSettingsTab from './settings-tab';

interface KetcherSmilesSettings {
  width: string;
  server: string;
}

const DEFAULT_SETTINGS: KetcherSmilesSettings = {
  width: '300',
  server: 'https://chem.codemastermind.xyz',
};

export default class KetcherSmilesPlugin extends Plugin {
  settings: KetcherSmilesSettings;

  async onload() {
    console.log("loading");
    await this.loadSettings();

    this.addSettingTab(new KetcherSmilesSettingsTab(this.app, this));

    this.registerMarkdownCodeBlockProcessor('smiles', async (source, el, ctx) => {
      const smiles = source.trim();

      try {
        const response = await axios.post(this.settings.server + '/v2/indigo/render', {
          struct: smiles,
          query: 'C',
          output_format: 'image/svg+xml',
          options: {}
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'image/svg+xml',
          },
        });

		const svg = response.data;
		const svgEl = document.createElement('div');
		svgEl.innerHTML = svg;
		el.appendChild(svgEl);
      } catch (error) {
        console.error(`Failed to render SMILES: ${error}`);
      }
    });
  }

  onunload(): void {
    console.log("unloading");
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}



