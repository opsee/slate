var should = require('chai').should()
, scapegoat = require('../index')
, log = scapegoat.log
;

describe('#log', function(){
  it('logs to console', function(){
    log().should.equal('f');
  })
});