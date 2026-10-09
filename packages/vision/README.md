# UIKey Vision Package

This package provides visual understanding capabilities for the UIKey project. It enables capturing full-page screenshots of a URL and slicing those screenshots into component-level images. This allows multimodal LLMs to analyze the visual layout alongside the DOM structure.

## Usage

Import the `captureAndSlice` function to process a URL:

```typescript
import { captureAndSlice } from 'vision';

async function run() {
    const url = 'https://example.com';
    const components = [
        { id: 1, x: 10, y: 20, width: 100, height: 50 },
        { id: 2, x: 120, y: 20, width: 200, height: 50 }
    ];

    const result = await captureAndSlice(url, components);
    
    console.log("Full screenshot buffer:", result.fullScreenshot);
    console.log("Slices:", result.slices);
}

run();
```

## API

### `captureAndSlice(url: string, components: any[])`

- **`url`**: The target URL to open and capture.
- **`components`**: An array of component objects containing bounding box details (e.g., `x`, `y`, `width`, `height`, `id`).

Returns an object containing:
- **`fullScreenshot`**: A Buffer or base64 string of the full-page screenshot.
- **`slices`**: An array of objects representing the sliced screenshots for each component.
