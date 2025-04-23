const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const app = express();
const { createServer } = require('http'); // importing http module
const { Server } = require('socket.io'); // importing socket.io

const chatSockets = require('./Sockets/chatSockets')


const userRoutes = require('./Routes/userRoutes')
const makeDbConnection = require('./Configuration/dbConnections');
const verifyTokenRoute = require('./Routes/verifyTokenRoute')
makeDbConnection();

const server = createServer(app); // creating server instance using http module

// websocket connection
const io = new Server(server, { // creating socket.io instance
    cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
})

chatSockets(io)


/**
 * @description middleWares
*/


app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));



/**
 * @description Routes
 * @route /api
 */
app.use('/api', userRoutes);
app.use('/api', verifyTokenRoute)







/**
 * @description Health check route
 * @route GET /
 */
app.get('/', (req, res) => {
    res.json({ message: "Server is healthy" });
})

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});