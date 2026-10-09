function getLuminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function parseColor(color: string): [number, number, number, number] | null {
    const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (match) {
        return [
            parseInt(match[1]),
            parseInt(match[2]),
            parseInt(match[3]),
            match[4] ? parseFloat(match[4]) : 1
        ];
    }
    return null;
}

function checkContrast(fg: string, bg: string): boolean {
    const fgColor = parseColor(fg);
    const bgColor = parseColor(bg);
    if (!fgColor || !bgColor) return true; 
    if (bgColor[3] === 0 || fgColor[3] === 0) return true;

    const l1 = getLuminance(fgColor[0], fgColor[1], fgColor[2]);
    const l2 = getLuminance(bgColor[0], bgColor[1], bgColor[2]);
    
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio >= 4.5;
}

console.log(checkContrast('rgb(0, 0, 0)', 'rgb(255, 255, 255)')); // true
console.log(checkContrast('rgb(127, 127, 127)', 'rgb(127, 127, 127)')); // false
