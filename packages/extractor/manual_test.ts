import { JSDOM } from 'jsdom';
import { extractDOM } from './src/index';

const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <body>
      <div style="background-color: rgb(255, 255, 255); color: rgb(200, 200, 200);">Low contrast text</div>
      <img>
      <button></button>
      <input type="text">
    </body>
  </html>
`);

const root = dom.window.document.body;

const originalGetComputedStyle = dom.window.getComputedStyle;
dom.window.getComputedStyle = (element) => {
    const style = originalGetComputedStyle(element);
    const mockStyle = { ...style } as any;
    
    if (element.tagName === 'DIV') {
        mockStyle.color = 'rgb(200, 200, 200)';
        mockStyle.backgroundColor = 'rgb(255, 255, 255)';
    } else {
        mockStyle.color = 'rgb(0, 0, 0)';
        mockStyle.backgroundColor = 'rgb(255, 255, 255)';
    }
    return mockStyle;
};
(global as any).window = dom.window;
(global as any).Node = dom.window.Node; // FIX THIS

root.getBoundingClientRect = () => ({
  x: 0, y: 0, width: 100, height: 100, top: 0, right: 100, bottom: 100, left: 0, toJSON: () => {}
});

root.querySelectorAll('*').forEach(el => {
  el.getBoundingClientRect = () => ({
    x: 0, y: 0, width: 100, height: 100, top: 0, right: 100, bottom: 100, left: 0, toJSON: () => {}
  });
});

const result = extractDOM(root as any);
console.log(JSON.stringify(result.children, null, 2));
