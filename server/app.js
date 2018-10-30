// Import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');

// Import custom files
const router = require('./router.js');

// Set environment variables
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

// Setup connection to mongodb
// Exit if connection failed
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Setup redis connection info
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};

let redisPASS;

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

// Setup express
const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`))); // re-route to /assets
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`)); // set favicon to use
app.disable('x-powered-by'); // hide header that shows the server framework for security reasons
app.use(compression()); // compresses/minifies the data being sent and received
app.use(bodyParser.urlencoded({
  extended: true,
})); // gives app ability to parse urlencoded data

app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
})); // setup the session (the cookies used to keep track of user sessions)

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' })); // hook up handlebars
app.set('view engine', 'handlebars'); // also hooks up express with handlebars
app.set('views', `${__dirname}/../views`); // sets the location of the views

app.use(cookieParser());

// csrf must come AFTER app.use(cookieParser());
// and app.use(session({......}));
// should come BEFORE the router
app.use(csrf());
app.use((err, req, res, next) => {
	// If everything is ok, continue with the request
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

	// Do nothing if someone tampered with the session
  console.log('Missing CSRF token');
  return false;
});

// Setup routing
// Pass express to the router for handling requests
router(app);

// Start the server
app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Listening on port ${port}`);
});
