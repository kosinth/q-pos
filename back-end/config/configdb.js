const mysql = require('mysql2/promise');

let connection;
const connect = async function (dbName) { 
 
    try {
        connection = await mysql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'Kosinth@1001',
            database : dbName,
            port:3306,
            insecureAuth: true,
            multipleStatements: true,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        })

        // if (connection){
        //     return connection;
        // }
        //connection = await mysql.createConnection(db_config);
        return connection;
    }catch (error) {
        console.error('Error connecting to Db :', error);
        connection = undefined;
        setTimeout(connect, 5000);
    }
}

module.exports = connect;