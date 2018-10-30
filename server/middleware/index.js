// Middleware to check is user is already logged in
// and redirects them appropriately
const requiresLogin = (req, res, next) => {
	// Redirect users to the login screen if they
	// are not logged in
  if (!req.session.account) {
    return res.redirect('/');
  }

	// Must call the next() function to continue
	// moving the request through the pipeline
  return next();
};

// Middleware to check if user is already logged out
// and redirects them appropriately
const requiresLogout = (req, res, next) => {
	// Redirect users to the app screen if they
	// are logged in
  if (req.session.account) {
    return res.redirect('/maker');
  }

	// Must call the next() function to continue
	// moving the request through the pipeline
  return next();
};

// Middleware to check if user is using HTTPS and
// redirects them if not
const requiresSecure = (req, res, next) => {
	// Redirects users to HTTPS if they are not using it
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

	// Must call the next() function to continue
	// moving the request through the pipeline
  return next();
};

// Middleware to bypass the check for HTTPS when
// in development
const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Note: process.env.NODE_ENV is a custom variable
// we created on Heroku to keep track of our environment.
// Check which middleware to use based on the
// environment (Production or Development)
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
