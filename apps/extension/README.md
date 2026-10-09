# UIKey Browser Extension

This is the UIKey browser extension built with Plasmo. It extracts UI data from the current page and sends it to the UIKey backend.

## How to load this extension into Chrome

1. Build the extension:
   ```bash
   npm run build
   ```
   This will generate a `build/chrome-mv3-prod` directory.

2. Open Google Chrome.
3. Go to the Extensions page by typing `chrome://extensions` in the address bar and pressing Enter.
4. Enable **Developer Mode** by toggling the switch in the top right corner.
5. Click the **Load unpacked** button that appears in the top left.
6. Select the `build/chrome-mv3-prod` directory (located in `apps/extension/build/chrome-mv3-prod`).
7. The UIKey extension should now be loaded and visible in your extensions list! Pin it to your toolbar for easy access.
