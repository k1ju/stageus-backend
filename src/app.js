const express = require('express');
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

app.use('/' ,pageApi);
app.use('/account', logger, accountApi);
app.use('/article', logger, articleApi);
app.use('/comment', logger, commentRouter);
app.use('/log', logApi);
app.use('/clicker',logger , clickerApi);
app.use('/cart', logger ,cartApi);

app.use((req, res, next) => {
    next({
        status: 404,
        message: 'API 없음',
    });
});

app.use((err, req, res, next) => {
    if (!err.status) err.status = 500;

console.log("thisis error stack start");

console.log("this is error stack : ", err.stack);

console.log("thisis error stack end");

    // console.log('err.message : ', err.stack);

    res.locals.message = err.stack;

    // next(err);

    res.status(err.status).send(err.stack);
});

module.exports = app;
