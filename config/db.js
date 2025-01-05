const mongoose = require('mongoose');

const connectToDB = async () => {
   await mongoose.connect('mongodb://0.0.0.0/testMessage');
   console.log('Database connected');
}

module.exports = connectToDB;