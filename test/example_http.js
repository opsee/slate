module.exports = {
  assertions: [
    {
      key: 'code',
      relationship: 'equal',
      operand: '200'
    },
    {
      key: 'code',
      relationship: 'notEqual',
      operand: '300'
    },
    {
      key: 'code',
      relationship: 'notEmpty',
      operand: '300'
    },
    {
      key: 'header',
      value: 'Accept-Encoding',
      relationship: 'equal',
      operand: 'gzip, deflate, sdch'
    },
    {
      key: 'header',
      value: 'Content-Type',
      relationship: 'notEqual',
      operand: 'text/html'
    },
    {
      key: 'header',
      value: 'Content-Type',
      relationship: 'regExp',
      operand: '^application/json$'
    },
    {
      key: 'header',
      value: 'Content-Type',
      relationship: 'notContain',
      operand: 'mp3'
    },
    {
      key: 'header',
      value: 'Content-Type',
      relationship: 'notEqual',
      operand: 'testingthis'
    },
    {
      key: 'body',
      relationship: 'notEmpty'
    },
    {
      key: 'body',
      relationship: 'notEqual',
      operand: 'foo'
    },
    {
      key: 'body',
      relationship: 'regExp',
      operand: '^\{'
    },
    {
      key: 'body',
      relationship: 'notEqual',
      operand: 'foo'
    },
    {
      key: 'body',
      relationship: 'contain',
      operand: 'SSLCert'
    },
    {
      key: 'code',
      relationship: 'greaterThan',
      operand: '199'
    },
    {
      key:'code',
      relationship:'lessThan',
      operand:'300'
    },
    {
      key:'header',
      relationship:'notEmpty',
      value:'Content-Type'
    },
    {
      key:'header',
      relationship: 'contain',
      value: 'Content-Type',
      operand: 'application/json'
    },
    {
      key:'header',
      relationship: 'contain',
      value: 'Accept-Encoding',
      operand: 'deflate'
    },
    {
      key:'json',
      relationship: 'equal',
      value: 'Instances[0].InstanceId',
      operand: 'i-1697eea4'
    },
    {
      key:'json',
      relationship: 'equal',
      value: 'HealthCheck.Interval',
      operand: 30.000
    },
    {
      key:'json',
      relationship: 'lessThan',
      value: 'HealthCheck.Interval',
      operand: 40
    },
    {
      key: 'metric',
      relationship: 'lessThan',
      value: 'request_latency_ms',
      operand: '300'
    },
    {
      key: 'metric',
      relationship: 'greaterThan',
      value: 'request_latency_ms',
      operand: '80.8354060000000'
    },
    {
      key: 'metric',
      relationship: 'equal',
      value: 'request_latency_ms',
      operand: '80.85'
    }
  ],
  'response': {
    'code': 200,
    'body': '{"Instances":[{"InstanceId":"i-1697eea4"}],"Subnets":["subnet-0378a966","subnet-eccedfaa"],"DNSName":"postato-1254052096.us-west-1.elb.amazonaws.com","VPCId":"vpc-79b1491c","LoadBalancerName":"postato","CanonicalHostedZoneName":"postato-1254052096.us-west-1.elb.amazonaws.com","SourceSecurityGroup":{"GroupName":"default","OwnerAlias":"933693344490"},"AvailabilityZones":["us-west-1a","us-west-1c"],"HealthCheck":{"Target":"HTTPS:8000/index.html","Timeout":5,"Interval":30,"HealthyThreshold":10,"UnhealthyThreshold":2},"SecurityGroups":["sg-1227fa77"],"ListenerDescriptions":[{"Listener":{"Protocol":"HTTPS","InstancePort":80,"InstanceProtocol":"HTTP","LoadBalancerPort":443,"SSLCertificateId":"arn:aws:iam::933693344490:server-certificate/InOpseeComWildcard"},"PolicyNames":["AWSConsole-SSLNegotiationPolicy-postato-1454712422460"]}],"CreatedTime":"2016-02-05T22:47:01.51Z","Scheme":"internet-facing","CanonicalHostedZoneNameID":"Z1M58G0W56PQJA"}',
    'headers': [
      {
        'name': 'Content-Type',
        'values': [
          'application/json'
        ]
      },
      {
        'name': 'Accept-Encoding',
        'values': [
          'gzip',
          'deflate',
          'sdch'
        ]
      },
      {
        'name': 'Vary',
        'values': [
          'origin'
        ]
      },
      {
        'name': 'Content-Length',
        'values': [
          '4'
        ]
      },
      {
        'name': 'Server',
        'values': [
          'Jetty(9.2.z-SNAPSHOT)'
        ]
      }
    ],
    'metrics': [
      {
        'name': 'request_latency_ms',
        'value': 80.84540600000001
      }
    ]
  }
};
