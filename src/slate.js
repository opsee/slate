var _ = require('lodash')
, chai = require ('chai')
, expect = chai.expect
, types = require('./types')
, relationships = require('./relationships')
;

var DECIMALS = 2;

function stringToFloat(string){
  return parseFloat(parseFloat(string, 10).toFixed(DECIMALS));
}

var Resolvers = {
  equal:{
    requiresOperand:true,
    fn:function(target, test){
      expect(target, 'Assertion target').to.equal(test);
    },
  },
  notEqual:{
    requiresOperand:true,
    fn:function(target, test){
      expect(target, 'Assertion target').to.not.equal(test);
    }
  },
  empty:{
    requiresOperand:false,
    fn:function(target){
      expect(target, 'Assertion target').to.not.be.ok;
    }
  },
  notEmpty:{
    requiresOperand:false,
    fn:function(target){
      expect(target, 'Assertion target').to.be.ok;
    }
  },
  contain:{
    requiresOperand:true,
    fn:function(target, test){
      test = new RegExp(_.escapeRegExp(test),'gi');
      expect(target, 'Assertion target').to.match(test);
    }
  },
  notContain:{
    requiresOperand:true,
    fn:function(target, test){
      test = new RegExp(_.escapeRegExp(test),'gi');
      expect(target, 'Assertion target').to.not.match(test);
    }
  },
  regExp:{
    requiresOperand:true,
    fn:function(target, test){
      test = new RegExp(test);
      expect(target, 'Assertion target').to.match(test);
    }
  },
  greaterThan:{
    requiresOperand:true,
    fn:function(target, test){
      target = stringToFloat(target);
      test = stringToFloat(test);
      expect(target, 'Assertion target').to.be.ok;
      expect(target, 'Assertion target').to.be.a('number');
      expect(test, 'Operand').to.be.a('number');
      expect(target, 'Assertion target').to.be.above(test);
    }
  },
  lessThan:{
    requiresOperand:true,
    fn:function(target, test){
      target = stringToFloat(target);
      test = stringToFloat(test);
      expect(target, 'Assertion target').to.be.ok;
      expect(target, 'Assertion target').to.be.a('number');
      expect(test, 'Operand').to.be.a('number');
      expect(target, 'Assertion target').to.be.below(test);
    }
  }
}

function ensureResponse(response){
  expect(response, 'Response').to.exist;
  expect(response, 'Response').to.be.an('object');
}

var Tests = {
  code: function(response){
    ensureResponse(response);
    return response.code.toString();
  },
  header: function(response, assertion){
    ensureResponse(response);
    expect(response.headers, 'Response headers').to.exist;
    expect(response.headers, 'Response headers').to.be.an('array');
    var header = _.chain(response.headers)
      .find(function(o) {
        return o.name.toLowerCase() == assertion.value.toLowerCase();
      })
      .get('values')
      .value();
    if(Array.isArray(header)){
      header = header.join(', ');
    }
    return header;
  },
  body: function(response, assertion){
    ensureResponse(response);
    expect(response.body, 'Response body').to.be.ok;
    if(typeof response.body === 'object'){
      response.body = JSON.stringify(response.body);
    }
    expect(response.body, 'Response body').to.be.a('string');
    return response.body;
  },
  json: function(response, assertion){
    ensureResponse(response);
    expect(response.body, 'Response.body').to.be.ok;
    expect(response.body, 'Response.body').to.be.a('string');
    var data;
    try {
      data = JSON.parse(response.body);
    } catch(err){}
    expect(data, 'Parsed JSON').to.be.ok;
    //use entire body if value is not present
    var dataValue = data;
    //otherwise try to select some data
    if (assertion.value){
      dataValue = _.get(data, assertion.value)
    }
    //need to convert to string here to conform to other tests
    if (dataValue && typeof dataValue !== 'string'){
      try {
        if (typeof dataValue === 'number'){
          dataValue = dataValue.toFixed(DECIMALS);
        } else {
          dataValue = JSON.stringify(dataValue);
        }
      } catch(err){}
    }
    expect(typeof dataValue, 'typeof json result').to.equal('string');
    return dataValue;
  },
  metric: function(response, assertion){
    //goal is to return a single metric from the full array
    ensureResponse(response);
    expect(response.metrics, 'Cloudwatch metrics').to.exist;
    expect(response.metrics, 'Cloudwatch metrics').to.be.an('array');
    expect(assertion.value, 'Assertion value').to.be.a('string');
    var values = _.chain(response.metrics)
    .filter(function(metric){
      return _.get(metric, 'name') === _.get(assertion, 'value');
    })
    .map(function(metric){
      expect(metric, 'metric').to.be.an('object');
      expect(metric, 'metric').to.contain.all.keys(['name', 'value']);
      return metric.value;
    })
    .compact()
    .sortBy(function(a){
      return a;
    })
    .value();
    expect(values, 'Metric values array').to.be.an('array');
    expect(values, 'Metric values array length').to.have.length.above(0);
    if (assertion.relationship === 'lessThan'){
      return _.last(values);
    } else if (assertion.relationship === 'greaterThan'){
      return _.head(values);
    }
    return values[0];
  },
  cloudwatch: function(response, assertion){
    return Tests.metric(response, assertion);
  }
}

//setup Resolvers
expect(Resolvers, 'Resolvers').to.exist;
expect(Resolvers, 'Resolvers').to.be.an('object');
var keys = _.keys(Resolvers);
expect(keys, 'Resolvers keys').to.exist;
expect(keys, 'Resolvers keys').to.have.length.above(0);
_.forEach(Resolvers, function(relationship){
  expect(relationship, 'Relationship').to.be.an('object');
  expect(relationship, 'Relationship').to.contain.all.keys(['requiresOperand', 'fn']);
});

module.exports = {
  validateAssertion: function(assertion) {
    if (assertion == null) {
      return 'Received null assertion.';
    }

    if (!(assertion.relationship in Resolvers)) {
      return 'Unsupported check relationship ' + assertion.relationship;
    }

    if (!(assertion.key in Tests)) {
      return 'Invalid key in assertion: ' + assertion.key;
    }

    return null;
  },

  checkAssertion: function(assertion, response) {
    try {
      expect(response, 'runAssertion response').to.be.ok;
      expect(response, 'Check response').to.be.an('object');
      expect(assertion, 'Assertion').to.be.ok;
      expect(assertion, 'Assertion').to.be.an('object');
      expect(assertion, 'Assertion').to.contain.all.keys(['key', 'relationship']);

      expect(_.find(types, {id: assertion.key}), 'Assertion type').to.be.an('object');
      var testFn = Tests[assertion.key];
      expect(testFn, 'The test function').to.be.a('function');

      var target = testFn.call(this, response, assertion);
      expect(target, 'Target').to.exist;

      if (typeof target === 'number'){
        //conform target to string
        target = target.toFixed(DECIMALS);
      }

      expect(_.find(relationships, {id: assertion.relationship}), 'Relationship').to.be.an('object');

      var resolver = Resolvers[assertion.relationship];
      expect(resolver, 'Resolver').to.be.an('object');
      
      var test = assertion.operand;
      //conform the assertion test to a string.
      //do not use decimals for status code because it is treated as int
      if (typeof test === 'number'){
        if (assertion.key === 'code'){
          test = test.toString();
        } else {
          test = test.toFixed(DECIMALS);
        }
      }
        
      if (resolver.requiresOperand){
        expect(test, 'Assertion test').to.exist;
        expect(test, 'Assertion test').to.be.a('string');
      }
      
      //the magic
      resolver.fn.call(this, target, test);
      
      return {
        success: true
      }

    } catch(err) {
      return {
        success:false,
        error:JSON.stringify(_.omit(err, ['stack', 'showDiff']))
      }
    }
  },
}
