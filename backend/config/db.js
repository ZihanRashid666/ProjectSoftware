// backend/config/db.js
const mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo connected');
  } catch (err) {
    console.error('Mongo connect error:', err.message);
    process.exit(1);
  }
};
