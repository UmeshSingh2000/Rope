const mongoose = require('mongoose');

const makeDbConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/Rope`);
        console.log('MongoDB connected successfully');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
}

module.exports = makeDbConnection;