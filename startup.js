global.mrequire = require("./lib/mrequire");


const Assumption = mrequire("core:assumption:v1.0.0");
global.assumption = Assumption.assumption;
global.assumptionEqual = Assumption.assumptionEqual;


global.use = require("./lib/use");


module.exports = {};
