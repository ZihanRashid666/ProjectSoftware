const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

dotenv.config(); // loads ./backend/.env by default

mongoose.set('strictQuery', true); // silence deprecation note

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));

// Only start HTTP server when run directly (not in tests)
if (require.main === module) {
  // ensure MONGO_URI exists
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is missing in backend/.env');
    process.exit(1);
  }
  connectDB(); // should use process.env.MONGO_URI internally

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
