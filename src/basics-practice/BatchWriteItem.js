// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'REGION'});

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    endpoint: 'http://localhost:8000/'
});

var params = {
  RequestItems: {
    "migrated_table": [
       {
         PutRequest: {
           Item: {
            'id': { 'N': '4' },
            'created_at': { 'S': '0000-00-00' },
            'is_required': {'N': '1'},
            'is_deleted': {'N': '0'},
            'updated_at': {'S': '1111-00-00'},
            'question' : {'S': 'This question-1 is pushed from batch request'}
           }
         }
       },
       {
         PutRequest: {
           Item: {
            'id': { 'N': '5' },
            'created_at': { 'S': '0000-00-00' },
            'is_required': {'N': '1'},
            'is_deleted': {'N': '0'},
            'updated_at': {'S': '2222-00-00'},
            'question' : {'S': 'This question-2 is pushed from batch request'}
           }
         }
       }
    ]
  }
};

ddb.batchWriteItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
