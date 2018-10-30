// Note: we export the controllers in index.js and then
// import index.js in other files so that we will have access
// to all of the controllers with a single import. Otherwise
// you'd have to import Account.js and Domo.js in other
// files just to gain access to them instead of doing one
// import to index.js, which will include everything
module.exports.Account = require('./Account.js');
module.exports.Domo = require('./Domo.js');
