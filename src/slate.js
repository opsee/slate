var _ = require('lodash')
, chai = require ('chai')
, expect = chai.expect
;

var Relationships = {
  equal:{
    requiresOperand:true,
    fn:function(target, test){
      if (typeof target === 'number'){
        target = target.toString();
      }
      expect(target, 'Assertion target').to.equal(test);
    },
  },
  notEqual:{
    requiresOperand:true,
    fn:function(target, test){
      if (typeof target === 'number'){
        target = target.toString();
      }
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
      if (typeof target === 'number'){
        target = target.toString();
      }
      test = new RegExp(test);
      expect(target, 'Assertion target').to.match(test);
    }
  },
  greaterThan:{
    requiresOperand:true,
    fn:function(target, test){
      target = parseInt(target, 10);
      test = parseInt(test, 10);
      expect(target, 'Assertion target').to.be.ok;
      expect(target, 'Assertion target').to.be.a('number');
      expect(test, 'Operand').to.be.a('number');
      expect(target, 'Assertion target').to.be.above(test);
    }
  },
  lessThan:{
    requiresOperand:true,
    fn:function(target, test){
      target = parseInt(target, 10);
      test = parseInt(test, 10);
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
        dataValue = JSON.stringify(dataValue);
      } catch(err){}
    }
    expect(typeof dataValue, 'typeof json result').to.equal('string');
    return dataValue;
  },
  cloudwatch: function(response, assertion){
    //goal is to return a single metric from the full array
    ensureResponse(response);
    expect(response.metrics, 'Cloudwatch metrics').to.exist;
    expect(response.metrics, 'Cloudwatch metrics').to.be.an('array');
    var values = _.chain(response.metrics)
    .map(function(metric){
      expect(metric, 'Metric').to.be.an('object');
      expect(assertion.value, 'Assertion.value').to.be.a('string');
      var matched = metric.Name === assertion.value;
      return matched ? _.get(metric, 'Value') : null;
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
  }
}

module.exports = {
  validateAssertion: function(assertion) {
    if (assertion == null) {
      return 'Received null assertion.';
    }

    if (!(assertion.relationship in Relationships)) {
      return 'Unsupported check relationship ' + assertion.relationship;
    }

    if (!(assertion.key in Tests)) {
      return 'Invalid key in assertion: ' + assertion.key;
    }

    return null;
  },

  checkAssertion: function(assertion, response) {
    try {
      //setup Relationships
      expect(Relationships, 'Relationships').to.exist;
      expect(Relationships, 'Relationships').to.be.an('object');
      var keys = _.keys(Relationships);
      expect(keys, 'Relationships keys').to.exist;
      expect(keys, 'Relationships keys').to.have.length.above(0);
      _.forEach(Relationships, function(relationship){
        expect(relationship, 'Relationship').to.be.an('object');
        expect(relationship, 'Relationship').to.contain.all.keys(['requiresOperand', 'fn']);
      });

      expect(response, 'runAssertion response').to.be.ok;
      expect(response, 'Check response').to.be.an('object');

      var target = Tests[assertion.key].call(this, response, assertion);
      expect(target, 'Target').to.exist;

      var test = assertion.operand;
      var relationship = Relationships[assertion.relationship];
      if(Relationships[assertion.relationship].requiresOperand){
        expect(test, 'Assertion test').to.exist;
        //conform the assertion test to a string, always.
        if(typeof test === 'number'){
          test = test.toString();
        }
        expect(test, 'Assertion test').to.be.a('string');
      }
      Relationships[assertion.relationship].fn.call(this, target, test);
      return {
        success: true
      }
    } catch(err) {
      delete err.stack;
      delete err.showDiff;
      return {
        success:false,
        error:JSON.stringify(err)
      }
    }
  },
}
