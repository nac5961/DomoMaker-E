// Import custom files
const models = require('../models');

// Get reference to Account model
const Account = models.Account;

// Function to display the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Function to display the home page when a user logs out
const logout = (req, res) => {
	// Remove a user's sessions so that the server knows the user isn't logged in
  req.session.destroy();
  res.redirect('/');
};

// Function to handle POST requests for logging in
const login = (request, response) => {
  const req = request;
  const res = response;


	// Case to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

	// Validate data
  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
		// Check if user could log in
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

	// Store user account information in the session
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// Function to handle POST requests for signing up
const signup = (request, response) => {
  const req = request;
  const res = response;

	// Cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

	// Validate data
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
		// Set data to save
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

		// Create document that we will save to the collection/database
		// Note: documents are entries in the collection.
    const newAccount = new Account.AccountModel(accountData);

		// Begin saving to the database
    const savePromise = newAccount.save();

		// Set what to do when the save is complete
    savePromise.then(() => {
		// Store user account information in the session
      req.session.account = Account.AccountModel.toAPI(newAccount);

      res.json({ redirect: '/maker' });
    });

		// Set what to do if the save fails
    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// Function to setup requesting tokens when our react
// app makes a request.
// This will give the app a one-time token when it
// needs to submit a form.
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// Export functions
module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
};
