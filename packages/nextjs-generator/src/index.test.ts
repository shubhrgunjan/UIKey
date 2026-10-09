import { generateNextPage } from './index';

const mockManifest = {
  tagName: "div",
  id: "main-container",
  className: "flex flex-col items-center justify-center",
  attributes: {
    "data-testid": "main"
  },
  styles: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(0, 0, 0)",
    padding: "16px",
    fontSize: "18px"
  },
  children: [
    {
      tagName: "h1",
      text: "Hello UIKey",
      styles: {
        color: "rgb(50, 50, 50)"
      }
    },
    {
      tagName: "img",
      attributes: {
        src: "/logo.png",
        alt: "Logo"
      }
    }
  ]
};

const result = generateNextPage(mockManifest);
console.log(result);
