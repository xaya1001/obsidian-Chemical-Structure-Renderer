import { Plugin } from 'obsidian';
import axios from 'axios';
import KetcherSmilesSettingsTab from './settings-tab';

interface KetcherSmilesSettings {
  width: string;
  server: string;
  format: 'image/svg;base64' | 'image/png;base64';
}

const DEFAULT_SETTINGS: KetcherSmilesSettings = {
  width: '300',
  server: 'https://chem.codemastermind.xyz',
  format: 'image/svg;base64',
};

export default class KetcherSmilesPlugin extends Plugin {
  settings: KetcherSmilesSettings;

  async getImage(smiles: string): Promise<string> {
    const response = await axios.post(this.settings.server + '/v2/indigo/render', {
      struct: smiles,
      query: 'C',
      output_format: this.settings.format,
      options: {}
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': this.settings.format,
      },
    });

    return response.data;
  }

  async renderImg(smiles: string, el: HTMLElement) {
    try {
      const imageData = await this.getImage(smiles);
      const imgEl = document.createElement('img');
      const mimeType = this.settings.format.replace(';base64', '+xml');
      imgEl.src = `data:${mimeType};base64,${imageData}`;
      imgEl.style.width = this.settings.width + 'px'; 
      // console.log(imgEl.src);
      el.appendChild(imgEl);
    } catch (error) {
      console.error(`Failed to render SMILES: ${error}`);
    }
  }

  async onload() {
    console.log("loading Ketcher Smiles");
    await this.loadSettings();

    this.addSettingTab(new KetcherSmilesSettingsTab(this.app, this));

    this.registerMarkdownCodeBlockProcessor('smiles', async (source, el, ctx) => {
      const smiles = source.trim();
      await this.renderImg(smiles, el);
    });

    this.registerMarkdownPostProcessor(async (el, ctx) => {
      el.querySelectorAll('code.language-smiles').forEach(async (codeElement) => {
        const smiles = codeElement.textContent || '';
        await this.renderImg(smiles, el);
      });
    });

  }

  onunload(): void {
    console.log("unloading Ketcher Smiles");
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}



