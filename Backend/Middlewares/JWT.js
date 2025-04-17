const jwt = require('jsonwebtoken')
const authenticateToken= (req,res,next)=>{
    try{
        const secret = process.env.JWT_SECRET;
        if(!secret){
            return res.status(500).json({ message: "env doesnt have JWT_SECRET" });
        }
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = authenticateToken;