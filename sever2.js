// import
const express = require("express")
//require : js에서 다른 js 임포트하기


//init
const app = express()
const port = 8000


// APIs

//홈페이지뒤에 "/"를 쓰면 반환하는 파일
// get: 매개변수2개(스트링,함수)
//스트링: api의 이름
//함수: 2개의 매개변수(리퀘스트,리스폰스)를 받음, 사용자가 api를 호출했을시, 수행할 동작을 적어준다
// ㄴ지금의 경우 파일만 반환할 것이므로 res.sendFile(절대경로 : 현재파일까지의 절대경로를 불러오는 함수: __dirname)
app.get("/",(req, res) => {
    // 반환하고자하는 파일,절대경로
    //__dirname:이파일까지의 절대경로 가져옴
    res.sendFile(`${__dirname}/public/index.html`)
})


app.get("/index",(req, res) => {
    // 반환하고자하는 파일,절대경로
    //__dirname:이파일까지의 절대경로 가져옴
    res.sendFile(`${__dirname}/public/index.html`)
})

app.post("/account",(req, res) => {
//프론트엔드가 보내준 값을 저장

// const id = req.body.id
// const pw = req.body.pw
// const name = req.body.name
const{id,pw,name} = req.body

//백엔드에서 프론트로 보내줄 값 미리 생성
const result={
    "success":false,
    "message":""
}
//db통신

//db통신 결과처리
result.success = true

// 값 반환
res.send(result)
})

//계정삭제api
app.delete("/account",(req,res) => {

})

// Web Server
// 웹서버 실행하고 작동하는코드
//웹서버 실행하자마자 해줘야하는 초기설정 해주는 곳
app.listen(port,() => {
    // 웹서버 초기설정
    console.log(`${port}번에서 HTTP웹 서버 시행`)
})







