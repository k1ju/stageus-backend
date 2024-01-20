const jwt = require('jsonwebtoken');
const env = require('../config/env');

const loginCheck = (isAdminCheck) => {
    return async (req, res, next) => {
        const { token } = req.headers;
        var tmp = isAdminCheck;

        try {
            // if (isAdmin !== true) throw new Error("관리자 권한필요")
            if (!token || token === '') throw new Error('no token');

            const payload = jwt.verify(token, env.secretCode);

            if (isAdminCheck) {
                // 관리자 권한 체크가 필요하다면

                const isadmin = payload.isadmin;
                if (isadmin !== true) throw new Error('관리자 권한 필요');
            }

            // if (loginUser[payload.idx] !== token) {
            //     throw new Error('로그인이 풀렸습니다.');
            // }

            req.user = payload;

            next();
        } catch (e) {
            next(e);
        }
    };
};

module.exports = loginCheck;
