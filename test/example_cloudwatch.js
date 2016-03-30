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
        'Name':'CPUUtilization',
        'Value':11, 
        'Tags':[],
        'Timestamp':''
      },
      {
        'Name':'CPUUtilization',
        'Value':94, 
        'Tags':[],
        'Timestamp':''
      },
      {
        'Name':'CPUUtilization',
        'Value':60, 
        'Tags':[],
        'Timestamp':''
      },
      {
        'Name':'Memory',
        'Value':60, 
        'Tags':[],
        'Timestamp':''
      },
      {
        'Name':'Memory',
        'Value':60, 
        'Tags':[],
        'Timestamp':''
      }
    ]
  }
}