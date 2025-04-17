const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const userRoutes = require('./Routes/userRoutes')
const makeDbConnection = require('./Configuration/dbConnections')
makeDbConnection();


app.use(express.json());

/**
 * @description middleWares
 */
app.use(cors({
    origin: process.env.ORIGIN,
}));



/**
 * @description Routes
 * @route /api
 */
app.use('/api', userRoutes);






/**
 * @description Health check route
 * @route GET /
 */
app.get('/', (req, res) => {
    res.json({ message: "Server is healthy" });
})



const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server is running on port 3000');
});