const dateToString =  require('../common/convert_to_string');
const BatchWrite = require('../common/Insert_Data');
const mysqlConnection = require('../common/mysql_connection');
const structureItems = require('../common/structure_items');
const dotenv = require('dotenv');
let connection = null;
dotenv.config();

let main = async () => {
  connection = await mysqlConnection();

  const TableName = 'security_question';
  const ItemList = [];
  let start_id = 0;

  const [results] = await connection.query(`SELECT * FROM ${TableName} LIMIT 25 OFFSET ${start_id}`)
  results.forEach(async item => {
  item = dateToString(item);
  item = structureItems(item);
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
  await BatchWrite(params);
};

main()
  .then(() => console.log("Security question migration completed!!", 'color: green;'))
  .catch((err) => console.log(`Security question migration failed with error ${err}!!`, 'color: red;'))
  .finally(() => connection && connection.end());