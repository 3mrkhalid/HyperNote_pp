const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next) =>{
    const authHeaders = req.headers.authorization || req.headers.Authorization; // "Bearer token"

    if(!authHeaders?.startsWith("Bearer ")) {
        return res.status(401).json({message:"Unauthorized"});
    } 

    const token = authHeaders.split(" ")[1]; // ["Bearer", "token"] , [1] => token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=> {
        if(err) {
            return res.status(403).json({message:"Forbidden"})
        }
        req.user = decoded.UserInfo;
        next()
    })
}

module.exports = verifyJWT;