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

// Choose a table(SQL server i.e PHP-Myadmin)
const tableName = 'security_question';

const ItemList = [];

// Retrieve all records from the table
connection.query(`SELECT * FROM ${tableName}`, function(error, results, fields) {
  if (error) throw error;

  console.log(results);
  // console.log(fields); //fields gives the information about the columns.

  // Initialize the Amazon DynamoDB client
  const dynamodb = new AWS.DynamoDB({
    region: process.env.REGION,
    endpoint: process.env.ENDPOINT
  });

  results.forEach(item => {

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

        console.log('ItemList is: ', ItemList);
        // Migrate the records to Amazon DynamoDB
        const params = {
            RequestItems: {
                'security_question': ItemList
            }
        };

        dynamodb.batchWriteItem(params, function(err, data) {
            if (err) {
            console.log("Error", err);
            } else {
            console.log("Success", data);
            }
        }); 

    })

  // Close the connection
  connection.end();

});
