const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const app = express();
const mainController = require('./controllers/main_controller');
app.use(express.json());

app.use(function(req,res,next){
  res.setHeader( "Access-Control-Allow-Origin", req.headers.origin || '*');
  res.setHeader( "Access-Control-Allow-Credentials", 'true');
  res.setHeader( "Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  res.setHeader( "Access-Control-Allow-Headers", '*');
  next();
});


app.get('/refresh-meal-plan', mainController.checkAndRefreshMealPlanIfApplicable);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});