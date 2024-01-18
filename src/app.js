const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // 세션을 db에 저장
const { pool } = require('./config/postgres');
const { logModel } = require('./config/mongodb');
const { logger } = require('./middlewares/logger');

const pageApi = require('./routers/page');
const accountApi = require('./routers/account');
const articleApi = require('./routers/article');
const commentRouter = require('./routers/comment');
const logApi = require('./routers/log');
const clickerApi = require('./routers/clicker');
const cartApi = require('./routers/cart');

require('dotenv').config();
const app = express();

app.use(
    session({
        store: new pgSession({
            pool: pool,
            createTableIfMissing: true,
            schemaName: 'class',
            tableName: 'user_session',
        }), // 세션을 db에 저장
        resave: true,
        saveUninitialized: true,
        secret: process.env.secretCode,
        cookie: {
            maxAge: 5 * 60 * 1000,
            rolling: true,
            id: 1,
        },
    })
);

app.use(express.json());

app.use('/', pageApi);
app.use('/account', logger, accountApi);
app.use('/article', logger, articleApi);
app.use('/comment', logger, commentRouter);
app.use('/log', logApi);
app.use('/clicker', clickerApi);
app.use('/cart', cartApi);

app.use((req, res, next) => {
    next({
        status: 404,
        message: 'API 없음',
    });
});

app.use((err, req, res, next) => {
    if (!err.status) err.status = 500;

    console.log('err.message : ', err.message);

    res.locals.message = err.message;

    res.status(err.status).send({ message: err.message });
});

module.exports = app;
