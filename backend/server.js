const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

mongoose.set('strictQuery', true);

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));

if (require.main === module) {
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is missing in backend/.env');
    process.exit(1);
  }
  connectDB();

  const PORT = process.env.PORT || 5001;
  app.listen(5001, "0.0.0.0", () => console.log("Server running on port 5001"));
}

module.exports = app;





