import { App, PluginSettingTab, Setting } from 'obsidian';
import ChemicalStructureRendererPlugin  from './main';

export default class ChemicalStructureRendererSettingsTab  extends PluginSettingTab {
  plugin: ChemicalStructureRendererPlugin ;

  constructor(app: App, plugin: ChemicalStructureRendererPlugin ) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Chemical Structure Renderer Plugin Settings' });

    new Setting(containerEl)
      .setName('Width')
      .setDesc('Set the width of the rendered structure (must be a number!)')
      .addText(text => text
        .setPlaceholder('Enter width')
        .setValue(this.plugin.settings.width)
        .onChange(async (value) => {
          this.plugin.settings.width = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Server')
      .setDesc('Set the server to use for rendering')
      .addText(text => text
        .setPlaceholder('Enter server URL')
        .setValue(this.plugin.settings.server)
        .onChange(async (value) => {
          this.plugin.settings.server = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
    .setName('Image format')
    .setDesc('Choose the format of the rendered image')
    .addDropdown(dropdown => {
      dropdown
        .addOption('image/svg;base64', 'SVG')
        .addOption('image/png;base64', 'PNG')
        .setValue(this.plugin.settings.format)
        .onChange(async (value: 'image/svg;base64' | 'image/png;base64') => {
          this.plugin.settings.format = value;
          await this.plugin.saveSettings();
        });
    });
  }
}
