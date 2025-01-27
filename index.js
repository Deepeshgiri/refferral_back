const express = require('express');
const dotenv = require('dotenv');
const route  = require('./routes/allRoutes');
const morgan = require('morgan');
const cors = require('cors');
const User = require('./models/userModel');

dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());
// Use routes
app.use('/', route);

// const abc =async()=>{
//   const getStage = await User.getAllStage();
// console.log("getStage:", getStage);
// }

// abc()



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});