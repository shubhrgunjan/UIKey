import { generateReactNative } from './packages/react-native-generator/src/index.js';

const manifest = {
  tokens: { colors: { primary: 'blue' } },
  layout: {
    type: 'View',
    style: { 'background-color': '$colors.primary', 'padding-top': '10px', 'margin-bottom': 20 },
    children: [
      {
         type: 'Text',
         style: { 'font-size': '16px' },
         children: 'Hello!'
      }
    ]
  }
};

console.log(generateReactNative(manifest));
