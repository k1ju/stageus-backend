const router = require("express").Router();
const { logCollection } = require("../config/postgres"); // 풀 속성이 아닌 풀 객체를 받아오는 것이므로 {pool}이아닌 pool


router.get('/', async (req, res, next) => {

    const result = {
        "data": {}
    }

    try{
        const sql = {}
        result.data = await logCollection.find(sql);

        console.log(result)
        res.status(200).send(result)
    } catch(e) {
        next(e);
    }
})

module.exports = router;






