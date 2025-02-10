const express = require('express');
const dotenv = require('dotenv');
const route = require('./routes/allRoutes');
const morgan = require('morgan');
const cors = require('cors');
const User = require('./models/userModel');
const bodyParser = require('body-parser'); // Import body-parser for larger payloads

dotenv.config();

// Initialize Express app
const app = express();

// Set a higher limit for JSON and URL-encoded requests
app.use(bodyParser.json({ limit: '50mb' })); // Allow JSON payloads up to 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Allow URL-encoded payloads up to 50MB

app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());

// Use routes
app.use('/', route);

// Async function to get stage from the database (for testing)
const getStageData = async () => {
  try {
    const getStage = await User.getAllStage();
    console.log("getStage:", getStage);
  } catch (error) {
    console.error("Error fetching stage data:", error);
  }
};

getStageData();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
