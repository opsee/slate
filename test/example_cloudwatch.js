module.exports = {
    assertions: [
        { 
            key: 'cloudwatch',
            relationship:'greaterThan',
            operand: '10'
        },
        { 
            key: 'cloudwatch',
            relationship:'lessThan',
            operand: '95'
        }
    ],
    'response': {
        'metrics': [
            {
                'Name':'CPUUtilization',
                'Value':90, 
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
            }
        ]
    }
}
