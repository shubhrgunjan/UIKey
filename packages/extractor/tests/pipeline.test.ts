import { JSDOM } from 'jsdom';
import { extractDOM, generateDesignTokens, generateAIPrompt } from '../src/index';

describe('Extractor Pipeline', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="root">
          <button class="btn">Click Me</button>
        </div>
      </body>
      </html>
    `);

    dom.window.HTMLElement.prototype.getBoundingClientRect = () => ({
      x: 0, y: 0, width: 100, height: 40, top: 0, right: 100, bottom: 40, left: 0,
      toJSON: () => {}
    });

    global.window = dom.window as any;
    global.document = dom.window.document;
    global.Node = dom.window.Node;
    global.HTMLElement = dom.window.HTMLElement;
    
    const originalGetComputedStyle = dom.window.getComputedStyle;
    global.window.getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
      const classList = Array.from(elt.classList);
      if (classList.includes('btn')) {
        return {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'rgb(255, 255, 255)',
          fontSize: '16px',
          padding: '10px 20px'
        } as any;
      }
      return originalGetComputedStyle(elt, pseudoElt);
    };
  });

  it('should extract, compile and format correctly', () => {
    const rootNode = document.getElementById('root') as HTMLElement;
    
    // 1. Extract
    const extractedTree = extractDOM(rootNode);
    
    // 2. Compile Design Tokens
    const designSystem = generateDesignTokens(extractedTree);
    
    expect(designSystem.colors['color-1']).toBe('rgb(255, 0, 0)');
    expect(designSystem.colors['color-2']).toBe('rgb(255, 255, 255)');
    expect(designSystem.fonts['size-1']).toBe('16px');

    // 3. Format Prompt
    const prompt = generateAIPrompt(designSystem, extractedTree);

    expect(prompt).toContain('# UI DESIGN SYSTEM INSTRUCTIONS');
    expect(prompt).toContain('# Design Tokens');
    expect(prompt).toContain('color-1: rgb(255, 0, 0)');
    expect(prompt).toContain('size-1: 16px');
    
    expect(prompt).toContain('<button');
    expect(prompt).toContain('bg="color-1"');
    expect(prompt).toContain('color="color-2"');
    expect(prompt).toContain('p="10px 20px"');
    expect(prompt).toContain('fs="size-1"');
    expect(prompt).toContain('Click Me');
  });
});
