const app = require('./src/app');
const env = require('./src/config/env');
const { mongoDB } = require('./src/config/mongodb');

const main = async () => {
    app.listen(env.HTTP_PORT, '0.0.0.0', () => {
        console.log(`${env.HTTP_PORT}번 포트번호 서버실행`);
    });
};

main();
