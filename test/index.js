var start = process.hrtime();

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

var end = process.hrtime(start);
console.info("Execution time (hr): %ds %dms", end[0], end[1]/1000000);
return console.log('No Errors.');