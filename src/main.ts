import { Plugin, requestUrl } from 'obsidian';

import ChemicalStructureRendererSettingsTab  from './settings-tab';

interface ChemicalStructureRendererSettings  {
  width: string;
  server: string;
  format: 'image/svg;base64' | 'image/png;base64';
}

const DEFAULT_SETTINGS: ChemicalStructureRendererSettings  = {
  width: '300',
  server: 'https://lifescience.opensource.epam.com',
  format: 'image/svg;base64',
};

export default class ChemicalStructureRendererPlugin  extends Plugin {
  settings: ChemicalStructureRendererSettings ;

  async getImage(smiles: string): Promise<string> {
    const response = await requestUrl({
      url: this.settings.server + '/v2/indigo/render', 
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': this.settings.format,
      },
      body: JSON.stringify({
        struct: smiles,
        query: '',
        output_format: this.settings.format,
        options: {}
      }),
    });

    return response.text;
  }

  async renderImage(smiles: string, el: HTMLElement) {
    try {
      const imageData = await this.getImage(smiles);
      const imgEl = document.createElement('img');
      const mimeType = this.settings.format.replace(';base64', '+xml');
      imgEl.src = `data:${mimeType};base64,${imageData}`;
      imgEl.style.width = this.settings.width + 'px'; 
      imgEl.classList.add('chemical-structure-image');
      // console.log(imgEl.src);
      el.appendChild(imgEl);
    } catch (error) {
      console.error(`Failed to render SMILES: ${error}`);
    }
  }

  async renderImagesFromCodeBlock(text: string, el: HTMLElement) {
    const smilesList = text.split('\n');
    const containerEl = document.createElement('div');
    containerEl.classList.add('chemical-structure-container');
    
    for (const smiles of smilesList) {
        if (smiles.trim() !== '') {
            await this.renderImage(smiles, containerEl);
        }
    }
    el.appendChild(containerEl);
  }

  async onload() {
    console.log("loading Chemical Structure Renderer Plugin");
    await this.loadSettings();

    this.addSettingTab(new ChemicalStructureRendererSettingsTab (this.app, this));

    this.registerMarkdownCodeBlockProcessor('smiles', async (source, el, ctx) => {
      const smiles = source.trim();
      await this.renderImagesFromCodeBlock(smiles, el);
    });

    this.registerMarkdownPostProcessor(async (el, ctx) => {
      el.querySelectorAll('code.language-smiles').forEach(async (codeElement) => {
        const smiles = codeElement.textContent || '';
        await this.renderImagesFromCodeBlock(smiles, el);
      });
    });

  }

  onunload(): void {
    console.log("unloading Chemical Structure Renderer Plugin");
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}



