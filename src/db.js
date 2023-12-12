//npm install --save mysql 설치하기

const db = require('mysql');
const connection = mysql.createConnection({
    host:"localhost",
    // "jdbc:mysql://localhost/week9"
    user:'stageus',
    password:'1234',
    port:3306,
    database:'project'
});

module.exports = connection;
