export function generateSwiftUI(uikeyManifest: any): string {
  const componentName = uikeyManifest.componentName || uikeyManifest.name || 'GeneratedView';
  
  const rootNode = uikeyManifest.root || (uikeyManifest.type ? uikeyManifest : null);

  let bodyContent = '';
  if (rootNode) {
    bodyContent = generateNode(rootNode, 2);
  } else {
    bodyContent = '        Text("Empty View")';
  }

  return `import SwiftUI

struct ${componentName}: View {
    var body: some View {
${bodyContent}
    }
}

struct ${componentName}_Previews: PreviewProvider {
    static var previews: some View {
        ${componentName}()
    }
}
`;
}

function generateNode(node: any, indentLevel: number): string {
  const indent = '    '.repeat(indentLevel);
  const type = node.type || 'VStack';
  
  let swiftUIType = type;
  if (type === 'layout' || type === 'VStack' || type === 'Column') swiftUIType = 'VStack';
  else if (type === 'HStack' || type === 'Row') swiftUIType = 'HStack';
  else if (type === 'Text' || type === 'text') swiftUIType = 'Text';
  else if (type === 'ZStack') swiftUIType = 'ZStack';
  else if (type === 'Button') swiftUIType = 'Button';
  else if (type === 'Image') swiftUIType = 'Image';
  else swiftUIType = type;

  let code = '';
  
  if (swiftUIType === 'Text') {
    const content = node.content || node.text || '';
    code = `${indent}Text("${content}")`;
  } else if (swiftUIType === 'Button') {
    const content = node.content || node.text || 'Button';
    code = `${indent}Button(action: {
${indent}    // Action
${indent}}) {
${indent}    Text("${content}")
${indent}}`;
  } else if (swiftUIType === 'Image') {
    const content = node.content || node.src || 'imageName';
    code = `${indent}Image("${content}")`;
  } else {
    code = `${indent}${swiftUIType} {\n`;
    if (node.children && Array.isArray(node.children)) {
      code += node.children.map((child: any) => generateNode(child, indentLevel + 1)).join('\n');
      code += '\n';
    }
    code += `${indent}}`;
  }

  if (node.style) {
    for (const [key, value] of Object.entries(node.style)) {
      if (key === 'background' || key === 'backgroundColor') {
        let color = value;
        if (typeof value === 'string' && ['red', 'blue', 'green', 'black', 'white', 'gray', 'yellow', 'orange', 'purple', 'pink'].includes(value.toLowerCase())) {
          color = `.${value.toLowerCase()}`;
        } else if (typeof color === 'string' && !color.startsWith('.')) {
          color = `Color("${color}")`; 
        }
        code += `\n${indent}.background(${color})`;
      } else if (key === 'foregroundColor' || key === 'color') {
        let color = value;
        if (typeof value === 'string' && ['red', 'blue', 'green', 'black', 'white', 'gray', 'yellow', 'orange', 'purple', 'pink'].includes(value.toLowerCase())) {
          color = `.${value.toLowerCase()}`;
        } else if (typeof color === 'string' && !color.startsWith('.')) {
          color = `Color("${color}")`;
        }
        code += `\n${indent}.foregroundColor(${color})`;
      } else if (key === 'padding') {
        if (typeof value === 'number' || typeof value === 'string') {
          code += `\n${indent}.padding(${value})`;
        } else {
          code += `\n${indent}.padding()`;
        }
      } else if (key === 'cornerRadius') {
        code += `\n${indent}.cornerRadius(${value})`;
      } else if (key === 'font') {
        code += `\n${indent}.font(.${value})`;
      } else if (key === 'width' || key === 'height') {
        code += `\n${indent}.frame(${key}: ${value})`;
      } else if (key === 'opacity') {
        code += `\n${indent}.opacity(${value})`;
      }
    }
  }

  return code;
}
