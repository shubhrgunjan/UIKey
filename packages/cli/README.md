# UIKey CLI

The UIKey CLI allows developers to seamlessly integrate generated UI context into their local projects.

## Usage

### `get [id]`

Fetches the extracted UI design tokens and layout context from a UIKey component and saves it locally to `.uikey/context.md`.

```bash
npx uikey get <component-id>
```

**Example:**

```bash
npx uikey get 12345
```

This will create a `.uikey/context.md` file in your current working directory, which you can use directly with an LLM or an AI-assisted IDE for high-fidelity code generation.
