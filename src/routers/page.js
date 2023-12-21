const router = require("express").Router();

const path = require("path");

// 이건 무슨페이지?
router.get("/",(req, res) => {
    // 반환하고자하는 파일,절대경로
    //__dirname:이파일까지의 절대경로 가져옴
    // res.sendFile(`${__dirname}/public/index.html`)
    res.sendFile(path.join(__dirname,"../../public/index.html"))
})


router.get("/index",(req, res) => {
    // 반환하고자하는 파일,절대경로
    //__dirname:이파일까지의 절대경로 가져옴
    // res.sendFile(`${__dirname}/public/index.html`)
    res.sendFile(path.join(__dirname,"../../public/index.html"))

})


module.exports = router