const cookie = require('cookie');
const jwt = require('jsonwebtoken');

// Middleware to authenticate socket connections using JWT

const socketMiddleware = (socket,next)=>{
    try{
        const secret = process.env.JWT_SECRET;
        if(!secret){
            return next(new Error('env doesnt have JWT_SECRET'));
        }
        const rawCookies = socket.handshake.headers.cookie;
        if (!rawCookies) {
            return next(new Error('Unauthorized'));
        }
        const cookies = cookie.parse(rawCookies);
        const token = cookies.token;
        if (!token) {
            return next(new Error('Unauthorized'));
        }
        const decoded = jwt.verify(token, secret);
        socket.user = decoded;
        next();
    }
    catch(err){
        console.log(err)
        return next(new Error('Authentication error'));
    }
}
module.exports = socketMiddleware;