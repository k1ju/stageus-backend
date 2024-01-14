const app = require('./src/app');
const { mongoDB } = require('./src/config/mongodb');

const main = async () => {

    app.listen(process.env.port, '0.0.0.0', () => {
        console.log(`${process.env.port}번 포트번호 서버실행`);
    });
};

main();
