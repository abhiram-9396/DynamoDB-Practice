const mysql = require('mysql2');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// Connect to the database
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD ? process.env.PASSWORD : '',
  database: process.env.DATABASE_NAME
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id: ' + connection.threadId);
});

// Initialize the Amazon DynamoDB client
const dynamodb = new AWS.DynamoDB({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT
});

// Choose a table(SQL server i.e PHP-Myadmin)
const TableName = 'security_question';

const ItemList = [];
let start_id = 0;

const asyncBatchWriteItem = (params) => {
    return new Promise((resolve, reject) => {
      dynamodb.batchWriteItem(params, function(err, data) {
          if (err) reject (err);

          resolve(data);
      });
  });
}

const main = async () => {

  try {
    // Retrieve all records from the table
    connection.query(`SELECT * FROM ${TableName} LIMIT 25 OFFSET ${start_id}`, async function(error, results, fields) {
      if (error) throw error;

      results.forEach(async item => {
        //converting created_at attribute to string...
        if(item['created_at']){
          if(typeof item['created_at'] === 'object')
          {
              item['created_at'] = item['created_at'].toString();
          }
        }
        //converting updated_at attribute to string...
        if(item['updated_at']){
          if(typeof item['updated_at'] === 'object')
          {
              item['updated_at'] = item['updated_at'].toString();
          }
        }
        //structuring the items based on their datatypes
        Object.keys(item).map(key => {
          let typeObject;
          switch(typeof item[key]){
              case 'string': 
              typeObject = { 'S': item[key] };
              break
              case 'number': 
              typeObject = { 'N': item[key].toString() };
              break
              case 'boolean': 
              typeObject = { 'B': item[key].toString() };
              break
              default:
              typeObject = { 'S': item[key] };
              break
            }
          item[key] = typeObject;
        })
          //pushing into the ItemList
          ItemList.push({
                  PutRequest: {
                  Item:item
              }
          })

        })    
        // Migrate the records to Amazon DynamoDB
        const params = {
            RequestItems: {
                'security_question': ItemList
            }
        };
        
        await asyncBatchWriteItem(params);
    });
  } catch (error) {
    console.error(err);
  }

}

main();

// Close the connection
connection.end();