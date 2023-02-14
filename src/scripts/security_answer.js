const dateToString =  require('../common/convert_to_string');
const BatchWrite = require('../common/Insert_Data');
const mysqlConnection = require('../common/mysql_connection');
const structureItems = require('../common/structure_items');
const dotenv = require('dotenv');
let connection = null;
dotenv.config();

let main = async () => {
  connection = await mysqlConnection();

  const TABLE_NAME = 'security_answer';
  const COUNT = (await connection.query(`SELECT COUNT(*) AS COUNT FROM ${TABLE_NAME}`))[0][0].COUNT;
  const OFFSET = 25;

  for (let start_id = 0; start_id < COUNT; start_id += OFFSET) {
    const [results] = await connection.query(`SELECT * FROM ${TABLE_NAME} LIMIT ${OFFSET} OFFSET ${start_id}`)
    results.forEach((item, index) => {
        item = dateToString(item);
        item = structureItems(item);
        let modifiedItem = {
            PutRequest: {
                Item: item
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
    await BatchWrite(params);
  }
}

main()
    .then(() => console.log("Security answer migration completed!!", 'color: green;'))
    .catch((err) => {
        console.log(`Security answer migration failed with error ${err}!!`, 'color: red;')
    })
    .finally(() => connection.end());
