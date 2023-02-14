const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const dynamodb = new AWS.DynamoDB({
    region: process.env.REGION,
    endpoint: process.env.ENDPOINT
});

function asyncBatchWriteItem(params){
    return new Promise((resolve, reject) => {
      dynamodb.batchWriteItem(params, function(err, data) {
          if (err) reject (err);

          resolve(data);
      });
  });
}

module.exports = asyncBatchWriteItem;