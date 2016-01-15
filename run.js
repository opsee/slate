const slate = require('./src/slate');
const example = require('./src/example');

const assertionsArray = example.assertions.map(assertion => {
  return slate.checkAssertion(assertion, example.response);
});

console.log(assertionsArray);
