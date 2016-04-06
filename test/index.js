const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const colors = require('colors');

const slate = require('../src/slate');

const examples = {
  http: require('./example_http'),
  cloudwatch: require('./example_cloudwatch')
}

var start = process.hrtime();

const tests = [];

_.keys(examples).forEach(key => {
  const ex = examples[key];
  console.log(`testing ${key}`.blue);
  const tests = ex.assertions.map(assertion => {
    return slate.checkAssertion(assertion, ex.response);
  });
  const errs = _.filter(tests, {success: false});
  if (errs.length){
    console.log(`Errors found in ${key}.`.red);
    console.log(errs);
    return process.exit(1);  
  }
  return console.log(`No errors found in ${key}`.green);
})

var end = process.hrtime(start);
const seconds = end[0];
const ms = end[1]/1000000;
console.log(`Execution time: ${seconds}s ${ms}ms`.yellow);