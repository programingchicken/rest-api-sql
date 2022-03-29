'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

const bodyParser = require('body-parser')
const {sequelize} = require('./models/index');
const userRoute = require('./routes/users')
const courseRoute = require('./routes/courses')

// const sequelize = require('./public/db/database.js');



//// const indexRoute = require('./public/routes/Book')

//Update database

// create the Express app
const app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


app.use(express.static(__dirname + '/seed'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extend: false }));
app.use(/*this is middle ware*/express.json());


sequelize.authenticate(console.log('db is running'))
sequelize.sync(/*{ Use to force the sync on databas force: true}*/).then(() => console.log('db is ready'))
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';



// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use('/api/users', userRoute);    
app.use('/api/courses', courseRoute);
// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found, Could be because the Course id dose not match with the Url id',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);



// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
