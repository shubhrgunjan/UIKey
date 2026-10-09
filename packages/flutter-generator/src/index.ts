export function generateFlutterWidget(uikeyManifest: any): string {
    function parseColorToHex(color: string): string {
        if (!color) return 'FF000000';
        if (color.startsWith('#')) {
            let hex = color.substring(1);
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            if (hex.length === 6) {
                return 'FF' + hex.toUpperCase();
            }
            if (hex.length === 8) {
                // flutter expects ARGB, css is RGBA
                const r = hex.substring(0, 2);
                const g = hex.substring(2, 4);
                const b = hex.substring(4, 6);
                const a = hex.substring(6, 8);
                return (a + r + g + b).toUpperCase();
            }
            return 'FF000000';
        }
        const rgbaMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
        if (rgbaMatch) {
            const r = parseInt(rgbaMatch[1] || '0', 10).toString(16).padStart(2, '0');
            const g = parseInt(rgbaMatch[2] || '0', 10).toString(16).padStart(2, '0');
            const b = parseInt(rgbaMatch[3] || '0', 10).toString(16).padStart(2, '0');
            let a = 'FF';
            if (rgbaMatch[4] !== undefined) {
                a = Math.round(parseFloat(rgbaMatch[4]) * 255).toString(16).padStart(2, '0');
            }
            return (a + r + g + b).toUpperCase();
        }
        return 'FF000000';
    }

    function processNode(node: any): string {
        const { tagName, className, text, children, styles } = node;

        let isFlex = false;
        let isColumn = false;

        if (className) {
            if (className.includes('flex')) {
                isFlex = true;
            }
            if (className.includes('flex-col')) {
                isColumn = true;
            }
        }
        if (styles) {
            if (styles.display === 'flex') {
                isFlex = true;
            }
            if (styles.flexDirection === 'column') {
                isColumn = true;
            }
        }

        let hasContainer = false;
        let containerProps: string[] = [];
        let boxDecorationProps: string[] = [];

        if (styles) {
            if (styles.padding && styles.padding !== '0px') {
                hasContainer = true;
                const pxMatch = styles.padding.match(/^([\d.]+)px$/);
                if (pxMatch) {
                    containerProps.push(`padding: const EdgeInsets.all(${pxMatch[1]})`);
                } else {
                    const parts = styles.padding.split(' ').map((p: string) => p.replace('px', ''));
                    if (parts.length === 2) {
                        containerProps.push(`padding: const EdgeInsets.symmetric(vertical: ${parts[0]}, horizontal: ${parts[1]})`);
                    } else if (parts.length === 4) {
                        containerProps.push(`padding: const EdgeInsets.fromLTRB(${parts[3]}, ${parts[0]}, ${parts[1]}, ${parts[2]})`);
                    } else {
                        containerProps.push(`padding: const EdgeInsets.all(8.0)`);
                    }
                }
            }
            
            if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent') {
                hasContainer = true;
                boxDecorationProps.push(`color: const Color(0x${parseColorToHex(styles.backgroundColor)})`);
            }
        }

        let childrenStrs: string[] = [];
        
        if (text) {
            let textStyles: string[] = [];
            if (styles && styles.color && styles.color !== 'rgba(0, 0, 0, 0)' && styles.color !== 'transparent') {
                textStyles.push(`color: const Color(0x${parseColorToHex(styles.color)})`);
            }
            if (styles && styles.fontSize && styles.fontSize !== '16px') {
                const pxMatch = String(styles.fontSize).match(/^([\d.]+)px$/);
                if (pxMatch) {
                    textStyles.push(`fontSize: ${pxMatch[1]}`);
                }
            }
            let styleArg = textStyles.length > 0 ? `, style: const TextStyle(${textStyles.join(', ')})` : '';
            const escapedText = text.replace(/'/g, "\\'").replace(/\n/g, "\\n");
            childrenStrs.push(`const Text('${escapedText}'${styleArg})`);
        }
        
        if (children && children.length > 0) {
            for (const child of children) {
                childrenStrs.push(processNode(child));
            }
        }

        let widgetStr = '';

        if (isFlex) {
            const flexType = isColumn ? 'Column' : 'Row';
            widgetStr = `${flexType}(\n  children: [\n${childrenStrs.map(c => c.split('\n').map(l => '    ' + l).join('\n')).join(',\n')}\n  ],\n)`;
        } else if (childrenStrs.length === 1 && !isFlex && !hasContainer) {
            widgetStr = childrenStrs[0] || '';
        } else if (childrenStrs.length > 0) {
            if (childrenStrs.length > 1) {
                widgetStr = `Column(\n  children: [\n${childrenStrs.map(c => c.split('\n').map(l => '    ' + l).join('\n')).join(',\n')}\n  ],\n)`;
            } else {
                widgetStr = childrenStrs[0] || '';
            }
        } else {
            widgetStr = `const SizedBox()`;
        }

        if (hasContainer) {
            let props = containerProps.join(', ');
            if (boxDecorationProps.length > 0) {
                if (props.length > 0) props += ', ';
                props += `decoration: const BoxDecoration(${boxDecorationProps.join(', ')})`;
            }
            widgetStr = `Container(\n  ${props},\n  child: ${widgetStr},\n)`;
        }

        return widgetStr;
    }

    let body = 'const SizedBox()';
    if (uikeyManifest) {
        body = processNode(uikeyManifest);
    }

    return `import 'package:flutter/material.dart';

class GeneratedWidget extends StatelessWidget {
  const GeneratedWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return ${body};
  }
}
`;
}
