const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'YourDBSettings',
  user: 'YourDBSettings',
  password: 'YourDBSettings',
  database: 'YourDBSettings'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to database as id', connection.threadId);
});

module.exports = connection;
