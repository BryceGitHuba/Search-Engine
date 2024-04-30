const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI; // This should be set in your environment variables

if (!mongoUri) {
  console.error('MongoDB connection URI is missing');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;