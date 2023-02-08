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
    'security_question': {
      Keys: [
        {
          id: { N: '1' },
          created_at: { S: '0000-00-00' }
        },
        {
          id: { N: '2' },
          created_at: { S: '0000-00-00' }
        },
        {
          id: { N: '3' },
          created_at: { S: '0000-00-00' }
        }
      ],
    //   ProjectionExpression: 'created_at, is_deleted_, question, updated_at'
    //If the ProjectionExpression is not given then by default all the attributes will be displayed.
    }
  }
};

ddb.batchGetItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    data.Responses.security_question.forEach(function(element, index, array) {
      console.log(element);
    });
  }
});
