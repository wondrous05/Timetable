const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization.split(" ")[1]

        if(!authHeader) {
            return res.status(401).json({msg: "No token found"})
        }

        const decoded = jwt.verify(authHeader, process.env.JWTSECRET)

        if(!decoded) {
            return res.status(403).json({msg: "Invalid Signature"})
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({msg:'you are not authorized'})
    }
}

module.exports = isAuthenticated;