//npm install --save mysql 설치하기

const db = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user:'stageus',
    password:'1234',
    port:8000,
    database:'project'
});