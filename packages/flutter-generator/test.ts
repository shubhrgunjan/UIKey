import { generateFlutterWidget } from './src/index';

const manifest = {
  tagName: "div",
  className: "flex flex-col",
  styles: {
    backgroundColor: "rgba(255, 0, 0, 1)",
    padding: "16px"
  },
  children: [
    {
      tagName: "span",
      text: "Hello World",
      styles: {
        color: "#ffffff",
        fontSize: "24px"
      }
    },
    {
      tagName: "div",
      className: "flex",
      children: [
        { tagName: "p", text: "Nested Row" }
      ]
    }
  ]
};

console.log(generateFlutterWidget(manifest));
