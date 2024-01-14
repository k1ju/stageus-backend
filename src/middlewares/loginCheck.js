const jwt = require("jsonwebtoken")
const loginUser = require("../modules/loginUser")

const loginCheck = (isAdminCheck) => {

    return (req, res, next) => {

        const { token } = req.headers
        var tmp = isAdminCheck

        try {
            // if (isAdmin !== true) throw new Error("관리자 권한필요")
            if (!token || token === "") throw new Error("no token");

            const payload = jwt.verify(token, process.env.secretCode);

            if (isAdminCheck) { // 관리자 권한 체크가 필요하다면
                const isadmin = payload.isadmin
                if (isadmin !== true) throw new Error("관리자 권한 필요")
            }

            // if (loginUser[payload.idx] !== token) {
            //     throw new Error('로그인이 풀렸습니다.');
            // }

            //
            req.user = {
                idx: payload.idx
            }
            // req.user = payload 이게더좋음. isadmin, idx만 넣어주기.

            console.log("정상실행")
            next();

        } catch (e) {
            console.log("권한없음")
            next(e);
        }
    }
}

module.exports = loginCheck
