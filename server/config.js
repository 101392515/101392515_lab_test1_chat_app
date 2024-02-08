// server/config.js

require('dotenv').config(); 

module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.jqnxggv.mongodb.net/test3?retryWrites=true&w=majority', // MongoDB connection URI
    jwtSecret: process.env.JWT_SECRET || '-', 
    port: process.env.PORT || 3000, 
    
};
