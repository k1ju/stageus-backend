const mongoose = require('mongoose');
const env = require('./env.js');

console.log('env.MONGODB_URI: ', env.MONGODB_URI);

mongoose.connect(env.MONGODB_URI);
const mongoDB = mongoose.connection;

mongoDB.on('open', () => {
    console.log('mongoDB connected!');
});

mongoDB.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

const logSchema = new mongoose.Schema({
    method: { type: String, required: true },
    url: { type: String, required: true },
    userIP: { type: String, required: true },
    userID: String,
    requset: Object,
    response: Object,
    status: String,
    errMessage: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const logModel = mongoose.model('log', logSchema);

module.exports = {
    logModel,
};
