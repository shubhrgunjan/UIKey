export function hexToHsl(hex: string): string {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  let r = 0, g = 0, b = 0;
  if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hStr = Math.round(h * 360).toString();
  const sStr = Math.round(s * 100).toString() + '%';
  const lStr = Math.round(l * 100).toString() + '%';

  return `${hStr} ${sStr} ${lStr}`;
}

export function generateShadcnTheme(uikeyManifest: any): string {
  const radius = uikeyManifest.radius || '0.5rem';
  
  const lightColors = uikeyManifest.colors?.light || {};
  const darkColors = uikeyManifest.colors?.dark || {};
  
  function formatColor(key: string, val: string): string {
    const variableName = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    
    let formattedVal = val;
    if (val.startsWith('#')) {
      formattedVal = hexToHsl(val);
    } else if (val.startsWith('hsl(')) {
      formattedVal = val.replace(/hsl\((.*)\)/, '$1').replace(/,/g, '');
    }
    
    return `    --${variableName}: ${formattedVal};`;
  }

  const lightVars = Object.entries(lightColors).map(([k, v]) => formatColor(k, v as string)).join('\n');
  const darkVars = Object.entries(darkColors).map(([k, v]) => formatColor(k, v as string)).join('\n');
  
  return `@layer base {
  :root {
${lightVars ? lightVars + '\n' : ''}    --radius: ${radius};
  }

  .dark {
${darkVars ? darkVars + '\n' : ''}  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
}
