# Extractor Package

This package is responsible for extracting a structured representation of the DOM and generating AI-ready context from it.

## Key Functions

### 1. `extractDOM(rootNode: HTMLElement)`
Traverses the DOM starting from `rootNode`, extracting essential styling (e.g., background-color, color, padding, font-size) and geometric data using `getBoundingClientRect`. Returns a clean JSON representation of the component tree.

### 2. `generateDesignTokens(uiTree)`
Recursively scans the JSON output of `extractDOM` to collect unique colors and font sizes, returning a `DesignSystem` object that maps these values to semantic tokens (e.g., `color-1`, `size-1`).

### 3. `generateAIPrompt(designSystem, sanitizedTree)`
Generates a highly compressed Markdown string tailored for LLMs. This prompt includes design system instructions, token mappings, and a flattened pseudo-JSX representation of the UI layout using reverse-mapped design system tokens to save context length.
