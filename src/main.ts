import { Plugin, requestUrl } from 'obsidian';

import ChemicalStructureRendererSettingsTab  from './settings-tab';

interface ChemicalStructureRendererSettings {
  /** Width of rendered image in pixels (numeric value as string) */
  width: string;
  /** URL of the Indigo rendering server endpoint */
  server: string;
  /** Image format with encoding type - supports SVG (vector) or PNG (raster) */
  format: 'image/svg;base64' | 'image/png;base64';
}

/** Default configuration values for new installations */
const DEFAULT_SETTINGS: ChemicalStructureRendererSettings = {
  width: '300',
  server: 'https://lifescience.opensource.epam.com', // EPAM's public Indigo service
  format: 'image/svg;base64',
};

export default class ChemicalStructureRendererPlugin  extends Plugin {
  settings: ChemicalStructureRendererSettings ;

  /**
   * Fetches chemical structure image from rendering server
   * @param smiles Valid SMILES string to render
   * @returns Promise resolving to base64-encoded image data
   */
  async getImage(smiles: string): Promise<string> {
    try {
      const response = await requestUrl({
        url: this.settings.server + '/v2/indigo/render', 
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': this.settings.format, // Server returns different format based on Accept header
        },
        body: JSON.stringify({
          struct: smiles,
          query: '', // Reserved for future search functionality
          output_format: this.settings.format,
          options: {} // Placeholder for future rendering options
        }),
      });

      if (response.status >= 400) {
        let errorMsg = `Server error: ${response.status}`;
        try {
          const errorData = JSON.parse(response.text);
          errorMsg += ` - ${errorData.message || errorData.error}`;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      return response.text;
    } catch (error) {
      throw new Error(`Rendering failed: ${error.message} (SMILES: ${smiles})`);
    }
  }

  /**
   * Renders SMILES string as image and appends to DOM element
   * @param smiles Input chemical structure notation
   * @param el Parent element to contain the image
   */
  async renderImage(smiles: string, el: HTMLElement) {
    try {
      const imageData = await this.getImage(smiles);
      const imgEl = document.createElement('img');
      // SVG requires '+xml' suffix while PNG uses standard base64
      const mimeType = this.settings.format.replace(';base64', '+xml');
      imgEl.src = `data:${mimeType};base64,${imageData}`;
      imgEl.style.width = this.settings.width + 'px'; 
      imgEl.classList.add('chemical-structure-image');
      // console.log(imgEl.src);
      el.appendChild(imgEl);
    } catch (error) {
      console.error(`Rendering Error: ${error}`);
      
      const errorContainer = document.createElement('div');
      errorContainer.classList.add('chemical-structure-error');
      
      const title = document.createElement('strong');
      title.textContent = '🚨 Chemical Structure Rendering Error';
      
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'Show error details';
      const pre = document.createElement('pre');
      pre.textContent = error.message;
      
      const code = document.createElement('code');
      code.textContent = `Problematic SMILES: ${smiles}`;

      details.append(summary, pre);
      errorContainer.append(title, details, code);
      el.appendChild(errorContainer);
    }
  }

  /**
   * Processes multi-line SMILES code blocks
   * @param text Raw content from code block
   * @param el Container element for all rendered structures
   */
  async renderImagesFromCodeBlock(text: string, el: HTMLElement) {
    const smilesList = text.split('\n');
    const containerEl = document.createElement('div');
    containerEl.classList.add('chemical-structure-container'); // Allows CSS styling
    
    // Process each line as separate SMILES string
    for (const smiles of smilesList) {
        if (smiles.trim() !== '') {
            await this.renderImage(smiles, containerEl);
        }
    }
    el.appendChild(containerEl);
  }

  /**
   * Plugin lifecycle hook - initializes core functionality
   */
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



