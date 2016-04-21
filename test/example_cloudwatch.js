module.exports = {
  assertions: [
    { 
      key: 'cloudwatch',
      value: 'CPUUtilization',
      relationship:'greaterThan',
      operand: 10
    },
    { 
      key: 'cloudwatch',
      value: 'CPUUtilization',
      relationship:'lessThan',
      operand: 95
    },
    { 
      key: 'cloudwatch',
      value: 'Memory',
      relationship:'equal',
      operand: 60
    },
    { 
      key: 'cloudwatch',
      value: 'ReadLatency',
      relationship:'equal',
      operand: '0.0006'
    },
    { 
      key: 'cloudwatch',
      value: 'ReadLatency',
      relationship:'greaterThan',
      operand: '0.00030000'
    },
    { 
      key: 'cloudwatch',
      value: 'ReadLatency',
      relationship:'greaterThan',
      operand: .0003
    }
  ],
  'response': {
    'metrics': [
      {
        'name':'CPUUtilization',
        'value':11, 
        'tags':[],
        'timestamp':''
      },
      {
        'name':'CPUUtilization',
        'value':94, 
        'tags':[],
        'timestamp':''
      },
      {
        'name':'CPUUtilization',
        'value':60, 
        'tags':[],
        'timestamp':''
      },
      {
        'name':'Memory',
        'value':60, 
        'tags':[],
        'timestamp':''
      },
      {
        'name':'Memory',
        'value':60, 
        'tags':[],
        'timestamp':''
      },
      {
        'name':'ReadLatency',
        'value':0.0004, 
        'tags':[],
        'timestamp':''
      },
      {
        'name':'ReadLatency',
        'value':0.000600, 
        'tags':[],
        'timestamp':''
      }
    ]
  }
}