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
  if (!req.body.name || !req.body.age || !req.body.ability) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

	// Create data to save to the database
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    ability: req.body.ability,
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

// Function to remove a domo
const removeDomo = (req, res) => {
	// Validate data
  if (!req.body.name2) {
    return res.status(400).json({ error: 'RAWR! Name is required' });
  }

  return Domo.DomoModel.findAllByName(req.body.name2, req.session.account._id, (err, docs) => {
	// Process errors
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }	else if (!docs || docs.length === 0) {
      return res.json({ error: 'No domos were found with that name' });
    }

    return Domo.DomoModel.deleteAllByName(req.body.name2, req.session.account._id, (err2) => {
		// Process errors
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      }

		// Send a successful response
      return res.json({ message: 'Successfully deleted domos' });
    });
  });
};

// Export functions
module.exports = {
  makerPage,
  make: makeDomo,
  getDomos,
  remove: removeDomo,
};
