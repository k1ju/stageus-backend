const express = require('express');
const { pool } = require('./config/postgres');
// const { logModel } = require('./config/mongodb');
const { logger } = require('./middlewares/logger');

const pageApi = require('./routers/page');
const accountApi = require('./routers/account');
const articleApi = require('./routers/article');
const commentRouter = require('./routers/comment');
const logApi = require('./routers/log');
const clickerApi = require('./routers/clicker');
const cartApi = require('./routers/cart');

const app = express();


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
