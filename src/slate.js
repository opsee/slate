var _ = require('lodash')
, chai = require ('chai')
, expect = chai.expect
, colors = require('colors')
;

var Relationships = {
  equal:{
    requiresOperand:true,
    fn:function(target,test){
      expect(target, 'Assertion target').to.equal(test);
    },
  },
  notEqual:{
    requiresOperand:true,
    fn:function(target,test){
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
    fn:function(target,test){
      test = new RegExp(_.escapeRegExp(test),'gi');
      expect(target, 'Assertion target').to.match(test);
    }
  },
  notContain:{
    requiresOperand:true,
    fn:function(target,test){
      test = new RegExp(_.escapeRegExp(test),'gi');
      expect(target, 'Assertion target').to.not.match(test);
    }
  },
  regExp:{
    requiresOperand:true,
    fn:function(target,test){
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
  code:function(response){
    ensureResponse(response);
    return response.code.toString();
  },
  header:function(response, assertion){
    ensureResponse(response);
    expect(response.headers, 'Response headers').to.exist;
    expect(response.headers, 'Response headers').to.be.an('array');
    var headers = response.headers.map(function(h){
      h.name = h.name.toLowerCase();
      return h;
    });
    var header = _.chain(response.headers).find({name:assertion.value}).get('values').value();
    if(Array.isArray(header)){
      header = header.join(', ');
    }
    return header;
  },
  body:function(response, assertion){
    ensureResponse(response);
    expect(response.body, 'Response body').to.be.ok;
    if(typeof response.body === 'object'){
      response.body = JSON.stringify(response.body);
    }
    expect(response.body, 'Response body').to.be.a('string');
    return response.body;
  }
}

function runAssertion(assertion, response){
  try{
    expect(response, 'runAssertion response').to.be.ok;
    expect(assertion, 'runAssertion assertion').to.be.ok;
    var target = Tests[assertion.key].call(this, response, assertion);
    expect(target, 'Target').to.exist;
    expect(target, 'Assertion target').to.be.a('string');
    var test = assertion.operand;
    var relationship = Relationships[assertion.relationship];
    if(Relationships[assertion.relationship].requiresOperand){
      expect(test, 'Assertion test').to.exist;
      if(typeof test === 'number'){
        test = test.toString();
      }
      expect(test, 'Assertion test').to.be.a('string');
    }
    Relationships[assertion.relationship].fn.call(this, target, test);
    return {
      success:true
    }
  }catch(err){
    delete err.stack;
    delete err.showDiff;
    return {
      success:false,
      error:JSON.stringify(err)
    }
  }
}

module.exports.runAssertion=runAssertion;