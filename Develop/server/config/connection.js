const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MongoDB connection URI is missing. Ensure that MONGODB_URI is set.');
  process.exit(1); // Exit the application if the database URI is not set
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Successfully connected to MongoDB.');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

module.exports = mongoose.connection;