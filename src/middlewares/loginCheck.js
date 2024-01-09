const jwt = require("jsonwebtoken")


const loginCheck = (req, res, next) => {
    const { token } = req.headers

    try{
        if(!token || token === "") throw new Error("no token");

        const payload = jwt.verify(token, process.env.secretCode) 
        
        req.user = {
            idx : payload.idx
        }

        next();

    }catch (e) {
        res.send();
    }
}


module.exports = loginCheck

