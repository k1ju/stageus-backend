const jwt = require("jsonwebtoken")

const loginCheck = (isAdminCheck) => {

    return (req, res, next) => { 

        const { token } = req.headers
        var tmp = isAdminCheck

        try {
            // if (isAdmin !== true) throw new Error("관리자 권한필요")
            if (!token || token === "") throw new Error("no token");

            const payload = jwt.verify(token, process.env.secretCode);

            if(isAdminCheck){ // 관리자 권한 체크가 필요하다면
                const isadmin = payload.isadmin 
                if(isadmin !== true) throw new Error("관리자 권한 필요")
            } 

            req.user = {
                idx: payload.idx
            }

            console.log("정상실행")
            next();

        } catch (e) {
            console.log("권한없음")
            next(e);
        }
    }
}

module.exports = loginCheck
