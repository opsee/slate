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
  }
}

function ensureResponse(response){
  expect(response, 'Response').to.exist;
  expect(response, 'Response').to.be.an('object');
}

var Tests = {
  statusCode:function(response){
    ensureResponse(response);
    return response.status.toString();
  },
  header:function(response, assertion){
    ensureResponse(response);
    expect(response.headers, 'Response headers').to.exist;
    expect(_.isArray(response.headers), 'Response headers is array').to.be.ok;
    expect(response.headers, 'Response Headers to have length').to.have.length.above(0);
    var header = _.chain(response.headers).filter(function(h){
      return h[0] == assertion.value;
    }).first().value();
    expect(header, 'Selected header "'+assertion.value+'"').to.be.ok;
    expect(_.isArray(response.headers), 'Response headers array').to.be.ok;
    expect(header, 'Header').to.have.length.above(1);
    return header[1];
  },
  body:function(response, assertion){
    ensureResponse(response);
    expect(response.data, 'Response body').to.be.ok;
    if(typeof response.data === 'object'){
      response.data = JSON.stringify(response.data);
    }
    expect(response.data, 'Response body').to.be.a('string');
    return response.data;
  }
}


function ensureCheck(obj){
  expect(_, 'Lodash').to.exist;

  //setup Tests
  expect(Tests, 'Tests').to.exist;
  expect(Tests, 'Tests').to.be.an('object');
  var keys = _.keys(Tests);
  expect(keys, 'Tests keys').to.exist;
  expect(keys, 'Tests keys').to.have.length.above(0);

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

  //ensure obj
  expect(obj, 'Check obj').to.exist;
  expect(obj, 'Check obj').to.be.an('object');
  expect(obj, 'Check obj').to.contain.all.keys(['assertions','response']);

  //ensure assertions
  expect(obj.assertions).to.be.an('array');
  expect(obj.assertions).to.have.length.above(0);

  //loop through each assertion
  _.forEach(obj.assertions, function(assertion, index){
    var inc = _.chain(Relationships).keys().includes(assertion.relationship).value();
    expect(inc, 'Unsupported check relationship "'+assertion.relationship+'"').to.be.ok;
    var inc = _.chain(Tests).keys().includes(assertion.key).value();
    expect(inc, 'Unsupported check assertion type "'+assertion.key+'"').to.be.ok;
  });

  //ensure response
  expect(obj.response, 'Check response').to.be.an('object');
  expect(obj.response, 'Check response').to.contain.all.keys(['status','headers']);

  console.log('Speak: Pass.'.blue);
  return true;
}

function runAssertion(obj){
  try{
    expect(obj, 'runAssertion obj').to.be.ok;
    expect(obj, 'runAssertion obj').to.be.an('object');
    expect(obj, 'runAssertion obj').to.contain.all.keys(['response','assertion']);
    var response = obj.response;
    expect(response, 'runAssertion response').to.be.ok;
    var assertion = obj.assertion;
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
    return {
      success:false,
      error:JSON.stringify(err)
    }
  }
}

module.exports = {
  testCheck:function(check){
    try{
      ensureCheck(check);
      return _.map(check.assertions, function(assertion){
        return runAssertion({response:check.response, assertion:assertion});
      });
    }catch(err){
      return {
        error:JSON.stringify(err)
      }
    }
  },
  testAssertion:function(obj){
    try{
      return runAssertion(obj);
    }catch(err){
      return {
        error:JSON.stringify(err)
      }
    }
  }
}