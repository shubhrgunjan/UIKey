export function generateTailwindConfig(uikeyManifest: any): string {
  const tokens = uikeyManifest?.tokens || uikeyManifest || {};
  
  const colors = tokens.colors || tokens.color || {};
  const spacing = tokens.spacing || {};
  const typography = tokens.typography || {};
  const fonts = typography.fontFamilies || tokens.fontFamilies || tokens.fonts || typography.fonts || {};
  const fontSizes = typography.fontSizes || tokens.fontSizes || {};

  function resolveTokenValue(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if ('$value' in obj) return obj.$value;
    if ('value' in obj) return obj.value;
    
    if (Array.isArray(obj)) {
        return obj.map(resolveTokenValue);
    }

    const resolved: any = {};
    for (const [key, val] of Object.entries(obj)) {
      resolved[key] = resolveTokenValue(val);
    }
    return resolved;
  }

  const resolvedColors = resolveTokenValue(colors);
  const resolvedSpacing = resolveTokenValue(spacing);
  const resolvedFonts = resolveTokenValue(fonts);
  const resolvedFontSizes = resolveTokenValue(fontSizes);

  const formatObj = (obj: any, indent: number) => {
    const str = JSON.stringify(obj, null, 2);
    if (str === '{}') return '';
    const spaces = ' '.repeat(indent);
    return str.split('\n').map((line, i) => i === 0 ? line : spaces + line).join('\n');
  };

  let config = `/** @type {import('tailwindcss').Config} */\n`;
  config += `module.exports = {\n`;
  config += `  content: [\n`;
  config += `    "./src/**/*.{js,jsx,ts,tsx,mdx}",\n`;
  config += `    "./app/**/*.{js,jsx,ts,tsx,mdx}",\n`;
  config += `  ],\n`;
  config += `  theme: {\n`;
  config += `    extend: {\n`;
  
  if (Object.keys(resolvedColors).length > 0) {
    config += `      colors: ${formatObj(resolvedColors, 6)},\n`;
  }
  if (Object.keys(resolvedSpacing).length > 0) {
    config += `      spacing: ${formatObj(resolvedSpacing, 6)},\n`;
  }
  if (Object.keys(resolvedFonts).length > 0) {
    const processedFonts: any = {};
    for (const [key, val] of Object.entries(resolvedFonts)) {
        if (typeof val === 'string') {
            processedFonts[key] = val.split(',').map((s: string) => s.trim());
        } else {
            processedFonts[key] = val;
        }
    }
    config += `      fontFamily: ${formatObj(processedFonts, 6)},\n`;
  }
  if (Object.keys(resolvedFontSizes).length > 0) {
    config += `      fontSize: ${formatObj(resolvedFontSizes, 6)},\n`;
  }

  config += `    },\n`;
  config += `  },\n`;
  config += `  plugins: [],\n`;
  config += `};\n`;

  return config;
}
