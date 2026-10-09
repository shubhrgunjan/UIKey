# UIKey VSCode Extension

Apply your UIKey design styles and UI rules directly inside VSCode!

This extension seamlessly fetches UIKey design context from the UIKey API and writes it to your workspace. It even configures `.cursorrules` automatically, ensuring that AI coding assistants like Cursor natively understand your design system.

## Features

- **Apply UIKey**: Run the `Apply UIKey` command, enter your UIKey ID, and the context will be fetched automatically.
- **AI Integration**: Automatically injects a directive into `.cursorrules` pointing to your `.uikey/context.md` file.

## How to Test Locally

1. Open this extension folder (`apps/vscode-extension`) in VSCode.
2. Run `npm install` to ensure all dependencies are installed.
3. Run `npm run compile` to build the extension.
4. Press `F5` to open a new window with the extension loaded in the Extension Development Host.
5. In the new window, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run `Apply UIKey`.

## Packaging the Extension

To package this extension into a `.vsix` file for installation or distribution:

1. Install `vsce` globally: `npm install -g @vscode/vsce`
2. Run `vsce package` in this directory.
3. You can then install the generated `.vsix` file in VSCode by running the `Extensions: Install from VSIX...` command from the Command Palette.
