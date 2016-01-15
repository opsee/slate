module.exports = {
  assertions:[
    {
      key:'code',
      relationship:'equal',
      operand:'200'
    },
    {
      key:'code',
      relationship:'notEqual',
      operand:'300'
    },
    {
      key:'code',
      relationship:'notEmpty',
      operand:'300'
    },
    {
      key:'header',
      value:'Accept-Encoding',
      relationship:'equal',
      operand:'gzip, deflate, sdch'
    },
    {
      key:'header',
      value:'Content-Type',
      relationship:'notEqual',
      operand:'text/html'
    },
    {
      key:'header',
      value:'Content-Type',
      relationship:'regExp',
      operand:'UTF-8$'
    },
    {
      key:'header',
      value:'Content-Type',
      relationship:'notContain',
      operand:'mp3'
    },
    {
      key:'header',
      value:'Content-Type',
      relationship:'notEqual',
      operand:'testingthis'
    },
    {
      key:'body',
      relationship:'notEmpty'
    },
    {
      key:'body',
      relationship:'notEqual',
      operand:'foo'
    },
    {
      key:'body',
      relationship:'regExp',
      operand:'k$'
    },
    {
      key:'body',
      relationship:'notEqual',
      operand:'foo'
    },
    {
      key:'body',
      relationship:'contain',
      operand:'A ok'
    },
    {
      key:'code',
      relationship:'greaterThan',
      operand:'199'
    },
    {
      key:'code',
      relationship:'lessThan',
      operand:'300'
    },
    {
      key:'header',
      relationship:'notEmpty',
      operand:'Content-Type'
    },
  ],
  "response": {
    "code": 200,
    "body": "A ok",
    "headers": [
      {
        "name": "Content-Type",
        "values": [
          "text/html; charset=UTF-8"
        ]
      },
      {
        "name": "Accept-Encoding",
        "values":[
          "gzip",
          "deflate",
          "sdch"
        ]
      },
      {
        "name": "Vary",
        "values": [
          "origin"
        ]
      },
      {
        "name": "Content-Length",
        "values": [
          "4"
        ]
      },
      {
        "name": "Server",
        "values": [
          "Jetty(9.2.z-SNAPSHOT)"
        ]
      }
    ],
    "metrics": [
      {
        "name": "request_latency_ms",
        "value": 80.84540600000001
      }
    ]
  }
}