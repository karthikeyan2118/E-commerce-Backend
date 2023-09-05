const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = () => {
  mongoose.connect((process.env.mongodb)); 
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // dbName: 'e-commerceshop_database');

  const db = mongoose.connection;
  db.once('open', (connect) => {
    console.log('Connected to MongoDB');
  });

  db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
};

module.exports = connectDB;
