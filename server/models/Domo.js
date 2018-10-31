// Import libraries
const mongoose = require('mongoose');
const _ = require('underscore');

// Set the promise used by mongoose
mongoose.Promise = global.Promise;

// Variable to hold the Domo Model
let DomoModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to a real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

// Create schema for Domo collection
const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  ability: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Function to set data in cookies
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  ability: doc.ability,
});

// Function to find a domo by its owner
DomoSchema.statics.findByOwner = (ownerId, callback) => {
	// Object to use for searching
  const search = {
    owner: convertId(ownerId),
  };

	// Perform the search
  return DomoModel.find(search).select('name age ability').exec(callback);
};

// Function to delete a domo by its name
DomoSchema.statics.deleteAllByName = (name, ownerId, callback) => {
	// Object to use for searching
  const search = {
    name,
    owner: convertId(ownerId),
  };

  // Perform the delete
  return DomoModel.deleteMany(search, callback);
};

// Function to find domos by its name
DomoSchema.statics.findAllByName = (name, ownerId, callback) => {
	// Object to use for searching
  const search = {
    name,
    owner: convertId(ownerId),
  };

  // Perform the search
  return DomoModel.find(search, callback);
};

// Setup the model
DomoModel = mongoose.model('Domo', DomoSchema);

// Export the model and schema
module.exports = {
  DomoModel,
  DomoSchema,
};
