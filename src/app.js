const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session); // 세션을 db에 저장
const { pool } = require("./config/postgres");
const { logModel } = require("./config/mongodb");
const { logger } = require("./middlewares/logger");
require("dotenv").config();
const app = express();

app.use(
  session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true,
      schemaName: "class",
      tableName: "user_session",
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

//페이지api
const pageApi = require("./routers/page");
app.use("/", pageApi);

//계정api
const accountApi = require("./routers/account");

app.use("/account", logger, accountApi);

//게시글 api
const articleApi = require("./routers/article");
app.use("/article", logger, articleApi);

//댓글 api
const commentApi = require("./routers/comment");
app.use("/comment", logger, commentApi);

//log 기록 검색 api
const logApi = require("./routers/log");
app.use("/log", logApi);


const clickerApi = require("./routers/clicker");
app.use("/clicker", clickerApi);


const cartApi = require("./routers/cart");
app.use("/cart", cartApi);


app.use((err, req, res, next) => {
  if (!err.status) err.status = 500;

  console.log("err.message : ", err.message);

  res.locals.message = err.message;

  res.status(err.status).send({ message: err.message });
});

module.exports = app;
