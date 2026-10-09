export function generateStorybook(uikeyManifest: any): string {
  const componentName = uikeyManifest.componentName || uikeyManifest.name || 'GeneratedComponent';
  const props = uikeyManifest.props || uikeyManifest.defaultProps || {};
  let variations = uikeyManifest.variations || {};
  
  let argTypes = '';
  const argTypesObj: any = {};
  
  if (typeof variations === 'object' && !Array.isArray(variations)) {
    for (const [key, values] of Object.entries(variations)) {
      if (Array.isArray(values)) {
        argTypesObj[key] = {
          control: 'select',
          options: values,
        };
      } else {
        argTypesObj[key] = values;
      }
    }
  }
  
  if (Object.keys(argTypesObj).length > 0) {
    argTypes = `\n  argTypes: ${JSON.stringify(argTypesObj, null, 2).replace(/\n/g, '\n  ')},`;
  }

  let extraStories = '';
  if (Array.isArray(variations)) {
    variations.forEach((v, i) => {
      const storyName = v.name ? v.name.replace(/\s+/g, '') : `Variation${i + 1}`;
      const storyArgs = v.props || v.args || {};
      extraStories += `\nexport const ${storyName}: Story = {\n  args: ${JSON.stringify(storyArgs, null, 2).replace(/\n/g, '\n  ')},\n};\n`;
    });
  } else if (typeof variations === 'object' && Object.keys(argTypesObj).length === 0) {
     // Object but not argTypes array mapping, maybe a mapping of story names to args
     for (const [key, value] of Object.entries(variations)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
           extraStories += `\nexport const ${key.replace(/\s+/g, '')}: Story = {\n  args: ${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')},\n};\n`;
        }
     }
  }

  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'UIKey/${componentName}',
  component: ${componentName},${argTypes}
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: ${JSON.stringify(props, null, 2).replace(/\n/g, '\n  ')},
};
${extraStories}`.trim() + '\n';
}
