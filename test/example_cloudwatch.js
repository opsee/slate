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
      }
    ]
  }
}