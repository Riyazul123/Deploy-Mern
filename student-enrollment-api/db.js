const mysql = require('mysql2');

// Database Connection
const db = mysql.createConnection({
    //Development 

    // host: 'localhost',
    // user: 'root',
    // password: 'root',
    // database: 'student_db'

    //Production

    host: 'binrmo1olh0fqhj5vobo-mysql.services.clever-cloud.com',
    user: 'unuuvhntasminfae',
    password: 'nBu2oT89tqN9cdheSFGJ',
    database: 'binrmo1olh0fqhj5vobo'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('MySQL Connected...');
});

module.exports = db; // ✅ Export the db connection


// db.js

// const mysql = require('mysql2');

// // Create a connection pool with promise support
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'student_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Export the promise-wrapped pool
// module.exports = pool.promise();
