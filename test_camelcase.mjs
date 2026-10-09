const toCamelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
console.log(toCamelCase('background-color'));
console.log(toCamelCase('justify-content'));
