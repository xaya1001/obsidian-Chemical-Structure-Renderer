# Ketcher Smiles Plugin for Obsidian

This plugin, empowered by [Ketcher](https://github.com/epam/ketcher), [Indigo](https://github.com/epam/Indigo), and inspired by [Obsidian-Chem](https://github.com/Acylation/obsidian-chem), enable visualization of chemical structures right in your Obsidian notes. Also, a special thank you to OpenAI's GPT-4 for contributing to this project.

## Functionality
This plugin allows you to represent chemical compounds in your notes using the SMILES notation. By simply writing the SMILES string inside a code block tagged with 'smiles', the plugin will render a visual representation of the chemical structure in the live preview mode.

## Usage
1. Install the plugin in Obsidian. (not yet, still in progress)
2. In your markdown note, create a new code block.
3. Tag the code block with 'smiles'.
4. Inside the code block, write down the SMILES string of the chemical compound you wish to visualize.

Example:

    ```smiles
    CC(C)C[C@H](NC([C@@H](NC(C1=CN=CC=N1)=O)CC2=CC=CC=C2)=O)B(O)O
    ```

5. Switch to live preview mode to see the structure.

## Compatibility Note
Due to overlapping functionalities, please be aware that this plugin may conflict with the [Obsidian-Chem](https://github.com/Acylation/obsidian-chem) plugin, as both plugins transform 'smiles' code blocks. Therefore, we recommend not enabling both plugins simultaneously to avoid any potential issues.

## Render service
In the settings, the 'server' field is set to a ketcher+indigo service hosted by me. If you have privacy concerns and wish to switch to your own service, you can set up a service following the tutorial in the link below. Once you have set up your service, you can change the 'server' field to your own domain URL.

tutorial link: in progress

## Settings
In the plugin settings, you can specify the width of the rendered image and the server address to use for rendering.

## License
This plugin is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

## Acknowledgements
Thanks to the [Ketcher](https://github.com/epam/ketcher) and [Indigo](https://github.com/epam/Indigo) projects for their open-source contributions to the field of chemical informatics, which made this plugin possible.

Many thanks to [Obsidian-Chem](https://github.com/Acylation/obsidian-chem).

## Support
For any issues or suggestions related to this plugin, please open an issue in the GitHub repository.