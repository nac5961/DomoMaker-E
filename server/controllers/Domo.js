// Import custom files
const models = require('../models');

// Get reference to account model
const Domo = models.Domo;

// Function to display the maker page
const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
	// Check for errors
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

	// Render page with data
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

// Function to create a domo
const makeDomo = (req, res) => {
	// Validate data
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

	// Create data to save to the database
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

	// Create a document with that data to save to the database
  const newDomo = new Domo.DomoModel(domoData);

	// Perform a save to the database
  const savePromise = newDomo.save();

	// If save is successful
  savePromise.then(() => {
    res.json({ redirect: '/maker' });
  });

  // If save is not successful
  savePromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return savePromise;
};

// Function to send a JSON response with the domos back to the user
const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
		// Process errors
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

		// Send the domo data in the response
    return res.json({ domos: docs });
  });
};

// Export functions
module.exports = {
  makerPage,
  make: makeDomo,
  getDomos,
};
