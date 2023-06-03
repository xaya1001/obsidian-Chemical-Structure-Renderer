import { App, PluginSettingTab, Setting } from 'obsidian';
import KetcherSmilesPlugin from './main';

export default class KetcherSmilesSettingsTab extends PluginSettingTab {
  plugin: KetcherSmilesPlugin;

  constructor(app: App, plugin: KetcherSmilesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Ketcher Smiles Plugin Settings' });

    new Setting(containerEl)
      .setName('Width')
      .setDesc('Set the width of the rendered structure')
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
  }
}
