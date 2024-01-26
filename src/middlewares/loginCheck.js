const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { visitorCount } = require('../modules/visitor.js');

/**
 * @return {import('express').RequestHandler}
 */
const loginCheck = (isAdminCheck) => {
    return async (req, res, next) => {
        // const [type, token] = req.headers.authorization.split(' ');
        const token = req.headers.token;

        try {
            //토큰에 넣는 것, 로그인체크 분리 -> 시도 기록 자체를 로그에 담을 수 있어야함.
            // if (type !== 'Bearer') throw new Error('invalid token type');
            if (!token) throw new Error('no token');

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

            await visitorCount(payload.idx);

            next();
        } catch (e) {
            next(e);
        }
    };
};

module.exports = loginCheck;
