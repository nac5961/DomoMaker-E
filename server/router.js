// Import custom files
const controllers = require('./controllers');
const mid = require('./middleware');

// Setup routing for requests
const router = (app) => {
	// GET
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

	// POST
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
};

// Export the function to use in app.js
module.exports = router;
