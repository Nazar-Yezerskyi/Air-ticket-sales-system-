const mysql = require('mysql2');

function dbConnection() {
  const connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the db ', err);
    } else {
      console.log('Connected to the db!');
    }
  });

  return connection;
}

module.exports = dbConnection;
