const mysql = require('mysql2');
const AWS = require('aws-sdk');

// Connect to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'growsari_iam'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }

  console.log('Connected as id: ' + connection.threadId);
});

// Choose a table
const tableName = 'security_question';

// Retrieve all records from the table
connection.query(`SELECT * FROM ${tableName}`, function(error, results, fields) {
  if (error) throw error;

  console.log(results);
  // console.log(fields); //fields gives the information about the columns.

  // Initialize the Amazon DynamoDB client
  const dynamodb = new AWS.DynamoDB({
    region: 'ap-south-1',
    accessKeyId: 'local',
    secretAccessKey: 'local',
    endpoint: 'http://localhost:8000'
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
          typeObject = { S: item[key] };
          break
        case 'number': 
          typeObject = { N: item[key].toString() };
          break
        case 'boolean': 
          typeObject = { B: item[key].toString() };
          break
        default:
          typeObject = { S: item[key] };
          break
      }
      item[key] = typeObject;
    })

    console.log(item)
    // Migrate the records to Amazon DynamoDB
    const params = {
      TableName: 'migrated_table',
      Item: item
  
    };
    // console.log(item);
    // Object.keys(item).forEach(key => {
    //   console.log(typeof item[key])
    // })

    //Insert into the table
    dynamodb.putItem(params, function(err, data) {
      if (err) {
        console.error('Error: ', err);
      } else {
        console.log('Success ', data);
      }
  
    });
    
  })
  // Close the connection
  connection.end();

});
