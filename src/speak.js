var _ = require('lodash')
, chai = require ('chai')
, expect = chai.expect
, colors = require('colors')
;

function test(assertion,res){
    if(!assertion || !res || assertion.operand===null || !assertion.relationship.name){
      return false;
    }
    var name = assertion.key.name;
    var relationship = assertion.relationship.name;
    switch(name){
      case 'Status Code':
        try{
          var code = assertion.operand;
          var status = res.status.toString();
          return Relationships[relationship].call(this,status,code);
        }catch(err){
          return false;
        }
      break;
      case 'Header':
        try{
          var name = typeof assertion.operand.name == 'object' ? assertion.operand.name[0] : assertion.operand.name;
          var value = typeof assertion.operand.value == 'object' ? assertion.operand.value[1] : assertion.operand.value;
          var header = _.chain(res.headers).filter(function(h){
            return h[0] == name;
          }).first().value();
          if(relationship == 'Is Empty'){
            if(!header){
              return true;
            }
            return !header[1];
          }else if(relationship == 'Is Not Empty'){
            return !!header[1];
          }
          if(!header){
            return false;
          }
          return Relationships[relationship].call(this,header[1],value);
        }catch(err){
          return false;
        }
      break;
      case 'Response Body':
      try{
        var text = assertion.operand;
        var body = JSON.stringify(res.data);
        if(relationship == 'Is Empty'){
          return !body;
        }else if(relationship == 'Is Not Empty'){
          return !!body;
        }
        return Relationships[relationship].call(this,body,text);
      }catch(err){
        return false;
      }
      break;
    }
  }

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
  contains:{
    requiresOperand:true,
    fn:function(target,test){
      if(typeof target === 'string' && typeof test === 'string'){
        target = target.toLowerCase();
        test = test.toLowerCase();
        return !!target.match(test);
      }
      return false;
    }
  },
  regExp:{
    requiresOperand:true,
    fn:function(target,test){
      if(typeof target === 'string' && typeof test === 'string'){
        return !!target.match(test);
      }
      return false;
    }
  }
}

function ensureResponse(obj){
  expect(obj, 'Check').to.exist;
  expect(obj, 'Check').to.be.an('object');
  expect(obj.response, 'Check response').to.exist;
  expect(obj.response, 'Check response').to.be.an('object');
}

var Tests = {
  statusCode:function(obj){
    ensureResponse(obj);
    return obj.response.status.toString();
  },
  header:function(obj, assertion){
    ensureResponse(obj);
    expect(obj.response.headers, 'Response headers').to.exist;
    expect(_.isArray(obj.response.headers), 'Response headers array').to.be.ok;
    expect(obj.response.headers).to.have.length.above(0);
    var header = _.chain(obj.response.headers).filter(function(h){
      return h[0] == assertion.value;
    }).first().value();
    expect(header, 'Selected header "'+assertion.value+'"').to.be.ok;
    expect(_.isArray(obj.response.headers), 'Response headers array').to.be.ok;
    expect(header, 'Header').to.have.length.above(1);
    return header[1];
  },
  body:function(obj, assertion){

  }
}


function setup(obj){
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
    var keys = _.keys(Relationships);
    var inc = _.includes(keys,assertion.relationship);
    expect(inc, 'Unsupported check relationship "'+assertion.relationship+'"').to.be.ok;
    if(Relationships[assertion.relationship].requiresOperand){
      expect(assertion.operand, 'Assertion operand').to.exist;
    }
    if(typeof assertion.operand === 'number'){
      assertion.operand = assertion.operand.toString();
    }
    expect(assertion.operand, 'Check assertion index '+index+' test').to.be.a('string');
    var keys = _.keys(Tests);
    var inc = _.includes(keys,assertion.key);
    expect(inc, 'Unsupported check assertion type "'+assertion.key+'"').to.be.ok;
  });

  //ensure response
  expect(obj.response, 'Check response').to.be.an('object');
  expect(obj.response, 'Check response').to.contain.all.keys(['status','headers']);

  console.log('Speak: Pass.'.blue);
  return true;
}

function ensureArguments(target, test){
  expect(target, 'Target').to.exist;
  expect(target, 'Target').to.be.a('string');
  expect(test, 'Test').to.exist;
  expect(test, 'Test').to.be.a('string');
}

function runTests(obj){
  _.forEach(obj.assertions, function(assertion, index){
    try{
      var target = Tests[assertion.key].call(this, obj, assertion);
      expect(target).to.be.a('string');
      var test = assertion.operand;
      ensureArguments(target, test);
      Relationships[assertion.relationship].fn.call(this, target, test);
      console.log(('Assertion #'+index+' pass.').green);
    }catch(err){
      console.log(('Assertion #'+index+' fail.').red);
      console.log(err);
    }
  })
}

module.exports = function(){
  var example = require('./example');
  try{
    setup(example);
    runTests(example);
  }catch(err){
    console.log(err);
    console.log('Speak: Fail.'.red)
  }
}