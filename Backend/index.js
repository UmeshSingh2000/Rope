const express = require('express');
const cors=require('cors');
require('dotenv').config();
const app = express();

app.use(cors({
    origin:process.env.ORIGIN,
}));



const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server is running on port 3000');
});