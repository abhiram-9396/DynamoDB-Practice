const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function mysqlConnection(){
    const connection =  await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER_NAME,
        password: process.env.PASSWORD ? process.env.PASSWORD : '',
        database: process.env.DATABASE_NAME
    });

    await connection.connect();
    console.log('Connected as id: ' + connection.threadId);

    return connection;
}


module.exports = mysqlConnection;