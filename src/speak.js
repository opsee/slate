var _ = require('lodash')
, chai = require ('chai')
, expect = chai.expect
, colors = require('colors')
;

// chai.use(require('chai-things'));

var Relationships = {
  equal:function(response,test){
    return angular.equals(response,test);
  },
  notEqual:function(response,test){
    return !angular.equals(response,test);
  },
  empty:function(response){
    return _.isEmpty(response);
  },
  notEmpty:function(response){
    return !_.isEmpty(response);
  },
  contains:function(response,test){
    if(typeof response === 'string' && typeof test === 'string'){
      response = response.toLowerCase();
      test = test.toLowerCase();
      return !!response.match(test);
    }
    return false;
  },
  regExp:function(response,test){
    if(typeof response === 'string' && typeof test === 'string'){
      return !!response.match(test);
    }
    return false;
  }
}

var AssertionTypes = ['statusCode','header','body'];

function test(assertion,res){
    if(!assertion || !res || assertion.value===null || !assertion.relationship.name){
      return false;
    }
    var name = assertion.type.name;
    var relationship = assertion.relationship.name;
    switch(name){
      case 'Status Code':
        try{
          var code = assertion.value;
          var status = res.status.toString();
          return Relationships[relationship].call(this,status,code);
        }catch(err){
          return false;
        }
      break;
      case 'Header':
        try{
          var name = typeof assertion.value.name == 'object' ? assertion.value.name[0] : assertion.value.name;
          var value = typeof assertion.value.value == 'object' ? assertion.value.value[1] : assertion.value.value;
          var header = _.chain(res.responseHeaders).filter(function(h){
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
        var text = assertion.value;
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

var example = {
  assertions:[
    {
      type:'statusCode',
      relationship:'equal',
      value:'200'
    }
  ],
  response:{
      "data": [
        {
          "code": "1xx",
          "phrase": "**Informational**",
          "description": "\"indicates an interim response for communicating connection status or request progress prior to completing the requested action and sending a final response.\" ~ [sure](http://www.urbandictionary.com/define.php?term=sure)",
          "spec_title": "RFC7231#6.2",
          "spec_href": "http://tools.ietf.org/html/rfc7231#section-6.2"
        },
        {
          "code": "100",
          "phrase": "Continue",
          "description": "\"indicates that the initial part of a request has been received and has not yet been rejected by the server.\"",
          "spec_title": "RFC7231#6.2.1",
          "spec_href": "http://tools.ietf.org/html/rfc7231#section-6.2.1"
        },
        {
          "code": "101",
          "phrase": "Switching Protocols",
          "description": "\"indicates that the server understands and is willing to comply with the client's request, via the Upgrade header field, for a change in the application protocol being used on this connection.\"",
          "spec_title": "RFC7231#6.2.2",
          "spec_href": "http://tools.ietf.org/html/rfc7231#section-6.2.2"
        },
        {
          "code": "2xx",
          "phrase": "**Successful**",
          "description": "\"indicates that the client's request was successfully received, understood, and accepted.\" ~ [cool](https://twitter.com/DanaDanger/status/183316183494311936)",
          "spec_title": "RFC7231#6.3",
          "spec_href": "http://tools.ietf.org/html/rfc7231#section-6.3"
        },
        {
          "code": "200",
          "phrase": "OK",
          "description": "\"indicates that the request has succeeded.\"",
          "spec_title": "RFC7231#6.3.1",
          "spec_href": "http://tools.ietf.org/html/rfc7231#section-6.3.1"
        }
      ],
      "status": 200,
      "config": {
        "method": "GET",
        "transformRequest": [
          null
        ],
        "transformResponse": [
          null
        ],
        "url": "/public/lib/know-your-http-well/json/status-codes.json",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Authorization": "HMAC 1--iFplvAUtzi_veq_dMKPfnjtg_SQ="
        }
      },
      "statusText": "OK",
      "responseHeaders": [
        [
          "date",
          "Mon, 29 Jun 2015 17:49:21 GMT"
        ],
        [
          "last-modified",
          "Tue, 16 Jun 2015 17:15:06 GMT"
        ],
        [
          "etag",
          "\"21828-1434474906000\""
        ],
        [
          "content-type",
          "application/json"
        ],
        [
          "cache-control",
          "public, max-age=0"
        ],
        [
          "connection",
          "keep-alive"
        ],
        [
          "accept-ranges",
          "bytes"
        ],
        [
          "content-length",
          "21828"
        ]
      ],
      "language": null
  }
}

function setup(obj){
  expect(_).to.exist;

  //setup AssertionTypes
  expect(AssertionTypes).to.exist;
  expect(AssertionTypes).to.have.length.above(0);

  //setup Relationships
  expect(Relationships).to.exist;
  expect(Relationships).to.be.an('object');
  var keys = _.keys(Relationships);
  expect(keys).to.exist;
  expect(keys).to.have.length.above(0);

  //ensure obj
  expect(obj).to.exist;
  expect(obj).to.be.an('object');
  expect(obj).to.contain.all.keys(['assertions','response']);

  //ensure assertions
  expect(obj.assertions).to.be.an('array');
  expect(obj.assertions).to.have.length.above(0);
  _.forEach(obj.assertions, function(assertion, index){
    var inc = _.includes(AssertionTypes,assertion.type);
    expect(inc, 'Unsupported assertion type "'+assertion.type).to.be.ok;
    var keys = _.keys(Relationships);
    var inc = _.includes(keys,assertion.relationship);
    expect(inc, 'Unsupported relationship "'+assertion.relationship+'"').to.be.ok;
  });

  console.log('Speak: Pass.'.blue);
  return true;
}

module.exports = function(){
  try{
    setup(example);
  }catch(err){
    console.log(err);
    console.log('Speak: Fail.'.red)
  }
}