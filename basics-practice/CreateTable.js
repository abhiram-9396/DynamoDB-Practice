// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Create the DynamoDB service object
// var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const ddb = new AWS.DynamoDB({
    region: 'ap-south-1',
    accessKeyId: 'local',
    secretAccessKey: 'local',
    endpoint: 'http://localhost:8000'
  });

var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'N'
    },
    {
      AttributeName: 'created_at',
      AttributeType: 'S'
    },
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'created_at',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'security_answer',
  StreamSpecification: {
    StreamEnabled: false
  }
};

// Call DynamoDB to create the table
ddb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});