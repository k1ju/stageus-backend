const router = require("express").Router();
const { logModel } = require("../config/mongodb"); // 풀 속성이 아닌 풀 객체를 받아오는 것이므로 {pool}이아닌 pool
const loginCheck = require("../middlewares/loginCheck");


//모든로그 불러오기
router.get('/all', loginCheck("isAdminCheck") ,async (req, res, next) => {

    const result = {
        "data": {}
    }

    try {
        const sql = {}
        const logs = await logModel.find(sql).sort({timestamp: -1});

        result.data = logs

        res.status(200).send(result)
    } catch (e) {
        next(e);
    }
})

//특정id 로그 불러오기
router.get('/id', loginCheck("isAdminCheck"), async (req, res, next) => {

    const { userID } = req.query
    const result = {
        "data": {}
    }

    try {
        const sql = { "userID": userID }
        const logs = await logModel.find(sql).sort({timestamp: -1});

        result.data = logs

        res.status(200).send(result)
    } catch (e) {
        next(e);
    }
})
// 특정 기간 로그 불러오기
router.get('/time', async (req, res, next) => {

    const minTime = req.body.minTime;
    const maxTime = req.body.maxTime || new Date();
    const result = {
        "data": {}
    }

    try {

        const sql = { "timestamp": { '$gte': new Date(minTime), "$lte": new Date(maxTime) } }
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

        let sql;
        if (method && url) {
            sql = { "method": method, "url": { "$regex": `^${url}` } }
        } else {
            sql = { "$or": [{ "method": method }, { "url": { "$regex": `^${url}` } }] }
        }

        const logs = await logModel.find(sql).sort({timestamp: -1});

        result.data = logs

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

        res.status(200).send(result)
    } catch (e) {
        next(e);
    }
})

module.exports = router;






