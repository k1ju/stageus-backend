const router = require("express").Router();
const { logModel } = require("../config/mongodb"); // 풀 속성이 아닌 풀 객체를 받아오는 것이므로 {pool}이아닌 pool
const loginCheck = require("../middlewares/loginCheck");


//모든로그 불러오기
router.get('/all', loginCheck("isAdminCheck") ,async (req, res, next) => {

    console.log("api실행")
    const result = {
        "data": {}
    }

    try {
        const sql = {}
        const logs = await logModel.find(sql).sort({timestamp: -1});

        result.data = logs

        console.log(logs)
        res.status(200).send(result)
    } catch (e) {
        next(e);
    }
})

//특정id 로그 불러오기
router.get('/id', loginCheck("isAdminCheck"), async (req, res, next) => {

    console.log("api실행")
    const { userID } = req.query
    const result = {
        "data": {}
    }

    try {
        const sql = { "userID": userID }
        const logs = await logModel.find(sql).sort({timestamp: -1});

        result.data = logs

        console.log(logs)
        res.status(200).send(result)
    } catch (e) {
        next(e);
    }
})
// 특정 기간 로그 불러오기
router.get('/time', async (req, res, next) => {

    const minTime = req.query.minTime;
    const maxTime = req.query.maxTime || new Date();
    const result = {
        "data": {}
    }

    try {
        console.log(maxTime);

        const sql = { "timestamp": { '$gte': new Date(minTime), "$lte": new Date(maxTime) } }
        console.log(sql)
        const logs = await logModel.find(sql).sort({timestamp: -1});

        result.data = logs

        res.status(200).send(result)
    } catch (e) {
        next(e);
    }
})

//api명 호출
router.get('/url', async (req, res, next) => {

    const method = req.query.method
    const url = req.query.url
    const result = {
        "data": {}
    }

    try {
        console.log("method: ", method);
        console.log("url: ", url);

        let sql;
        if (method && url) {
            sql = { "method": method, "url": { "$regex": `^${url}` } }
        } else {
            sql = { "$or": [{ "method": method }, { "url": { "$regex": `^${url}` } }] }
        }

        console.log("sql:", sql)
        const logs = await logModel.find(sql).sort({timestamp: -1});

        result.data = logs
        console.log(logs)

        res.status(200).send(result)
    } catch (e) {
        next(e);
    }
})



//모든로그 삭제
router.delete('/', async (req, res, next) => {

    const result = {
        "data": {}
    }

    try {
        const sql = {}
        const logs = await logModel.deleteMany(sql);

        result.data = logs

        console.log(logs)
        res.status(200).send(result)
    } catch (e) {
        next(e);
    }
})

module.exports = router;






