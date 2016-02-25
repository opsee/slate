var chai = require('chai')
, expect = chai.expect
, _ = require('lodash')
;

const slate = require('../src/slate');
const example = require('./example');

const assertionsArray = example.assertions.map(assertion => {
  return slate.checkAssertion(assertion, example.response);
});

const errs = _.filter(assertionsArray, {success: false});
if (errs.length){
  console.log('Errors found.');
  console.log(errs);
  return process.exit(1);
}
return console.log('No Errors.');