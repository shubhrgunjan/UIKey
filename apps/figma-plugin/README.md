# UIKey Figma Plugin

This is the Figma plugin for UIKey. It allows designers to export selected frames directly into the UIKey ecosystem.

## How to Install and Run Locally

To load this plugin into your local Figma desktop app for development or testing, follow these steps:

1. **Install Dependencies and Build**
   Open your terminal, navigate to this directory, and run the following commands to install dependencies and build the plugin:
   ```bash
   npm install
   npm run build
   ```

2. **Open the Figma Desktop App**
   Make sure you are using the Figma Desktop app (development plugins cannot be loaded in the browser version).

3. **Import the Plugin**
   - Open any Figma design file.
   - Right-click anywhere on the canvas.
   - Go to **Plugins** > **Development** > **Import plugin from manifest...**
   - In the file dialog, navigate to the `apps/figma-plugin` folder in this repository.
   - Select the `manifest.json` file and click **Open**.

4. **Run the Plugin**
   - Select a frame (or multiple frames) on your Figma canvas.
   - Right-click > **Plugins** > **Development** > **UIKey Exporter** (or find it in your recent plugins).
   - Click the "Export Frame to UIKey" button in the plugin UI.
   - A link to your exported frame on UIKey will be generated, which you can easily copy!

## Developing

- `code.ts`: Contains the main plugin logic that runs in the Figma sandbox (has access to the design canvas).
- `ui.html`: Contains the UI for the plugin (has access to the network).
- Remember to run `npm run build` whenever you make changes to `code.ts`.
