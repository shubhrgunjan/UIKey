import { generateReactNative } from './packages/react-native-generator/src/index.js';

const manifest = {
  tokens: { colors: { primary: 'blue' } },
  layout: {
    type: 'View',
    style: { backgroundColor: '$colors.primary', padding: 10 },
    children: [{ type: 'Text', children: 'Hello!' }]
  }
};

console.log(generateReactNative(manifest));
