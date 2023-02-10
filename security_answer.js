const mysql = require('mysql2/promise');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
let connection = null;

dotenv.config();

// Initialize the Amazon DynamoDB client
const dynamodb = new AWS.DynamoDB({
    region: process.env.REGION,
    endpoint: process.env.ENDPOINT
});

const asyncBatchWriteItem = (params) => {
    return new Promise((resolve, reject) => {
        dynamodb.batchWriteItem(params, function(err, data) {
            if (err) reject (err);

            resolve(data);
        });
    });
}

let main = async () => {
    try {
        // Connect to the database
        connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER_NAME,
            password: process.env.PASSWORD ? process.env.PASSWORD : '',
            // database: process.env.DATABASE_NAME
        });

        // Test the connection
        await connection.connect(function(err) {
            if (err) {
              console.error('Error connecting: ' + err.stack);
              return;
            }
          
            console.log('Connected as id: ' + connection.threadId);
        });

        const COUNT = 5000;            
        const OFFSET = 25;
        const TABLE_NAME = 'security_answer';

        for (let start_id = 0; start_id < COUNT; start_id += OFFSET) {
            const [results] = await connection.query(`SELECT * FROM ${TABLE_NAME} LIMIT ${OFFSET} OFFSET ${start_id}`)
            
            results.forEach((item, index) => {
                //converting created_at attribute to string...
                if(item['created_at']) {
                    if(typeof item['created_at'] === 'object') {
                        item['created_at'] = item['created_at'].toString();
                    }
                }

                //converting updated_at attribute to string...
                if(item['updated_at']){
                    if(typeof item['updated_at'] === 'object') {
                        item['updated_at'] = item['updated_at'].toString();
                    }
                }

                // structuring the items based on their datatypes
                Object.keys(item).map(key => {
                    let typeObject;

                    switch(typeof item[key]){
                        case 'string': 
                            typeObject = { 'S': item[key] };
                            break;
                        case 'number': 
                            typeObject = { 'N': item[key].toString() };
                            break;
                        case 'boolean': 
                            typeObject = { 'B': item[key].toString() };
                            break;
                        default:
                            typeObject = { 'S': item[key].toString() };
                            break;
                    }

                    item[key] = typeObject;
                });

                let modifiedItem = {
                    PutRequest: {
                        Item:item
                    }
                }

                results[index] = modifiedItem;
            });

            const params = {
                RequestItems: {
                    'security_answer': results
                }
            };

            console.log(`Writing ${start_id} to ${start_id + OFFSET}`);
            
            await asyncBatchWriteItem(params);
        }
        connection.close();
    } catch (err) {
        console.error(err);
    } finally {
        connection && connection.close();
    }


}

main();